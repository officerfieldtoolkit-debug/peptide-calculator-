import { supabase } from './supabase';

export const forumService = {
    // Categories
    async getCategories() {
        const { data, error } = await supabase
            .from('forum_categories')
            .select('*')
            .order('sort_order');

        if (error) throw error;
        return data;
    },

    async getCategoryWithTopics(slug, page = 1, limit = 20) {
        const offset = (page - 1) * limit;

        // Get category
        const { data: category, error: catError } = await supabase
            .from('forum_categories')
            .select('*')
            .eq('slug', slug)
            .single();

        if (catError) throw catError;

        // Get topics - try with profiles view first, fall back to simple query
        let topics = [];
        let count = 0;

        try {
            // Try using the view
            const { data, error, count: totalCount } = await supabase
                .from('forum_topics_with_profiles')
                .select('*', { count: 'exact' })
                .eq('category_id', category.id)
                .order('is_pinned', { ascending: false })
                .order('created_at', { ascending: false })
                .range(offset, offset + limit - 1);

            if (!error) {
                topics = data || [];
                count = totalCount || 0;
            } else {
                throw error;
            }
        } catch (e) {
            // Fallback to simple query without author
            const { data, error, count: totalCount } = await supabase
                .from('forum_topics')
                .select('*', { count: 'exact' })
                .eq('category_id', category.id)
                .order('is_pinned', { ascending: false })
                .order('created_at', { ascending: false })
                .range(offset, offset + limit - 1);

            if (error) throw error;
            topics = (data || []).map(t => ({ ...t, full_name: null }));
            count = totalCount || 0;
        }

        return { category, topics, totalCount: count };
    },

    // Topics
    async getTopic(topicId) {
        // Increment view count
        await supabase.rpc('increment_topic_views', { topic_id: topicId }).catch(() => { });

        // Try view first, fall back to simple join
        try {
            const { data, error } = await supabase
                .from('forum_topics_with_profiles')
                .select('*')
                .eq('id', topicId)
                .single();

            if (!error && data) {
                // Get category info separately
                const { data: category } = await supabase
                    .from('forum_categories')
                    .select('name, slug')
                    .eq('id', data.category_id)
                    .single();

                return { ...data, category };
            }
        } catch (e) {
            // Fall through to fallback
        }

        // Fallback
        const { data, error } = await supabase
            .from('forum_topics')
            .select('*')
            .eq('id', topicId)
            .single();

        if (error) throw error;

        // Get category separately
        const { data: category } = await supabase
            .from('forum_categories')
            .select('name, slug')
            .eq('id', data.category_id)
            .single();

        return { ...data, category, full_name: null };
    },

    async getTopicPosts(topicId, page = 1, limit = 20) {
        const offset = (page - 1) * limit;

        // Try view first
        try {
            const { data, error, count } = await supabase
                .from('forum_posts_with_profiles')
                .select('*', { count: 'exact' })
                .eq('topic_id', topicId)
                .order('created_at', { ascending: true })
                .range(offset, offset + limit - 1);

            if (!error) {
                return { posts: data || [], totalCount: count || 0 };
            }
        } catch (e) {
            // Fall through
        }

        // Fallback
        const { data, error, count } = await supabase
            .from('forum_posts')
            .select('*', { count: 'exact' })
            .eq('topic_id', topicId)
            .order('created_at', { ascending: true })
            .range(offset, offset + limit - 1);

        if (error) throw error;
        return { posts: (data || []).map(p => ({ ...p, full_name: null })), totalCount: count || 0 };
    },


    async createTopic(categoryId, title, content) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Not authenticated');

        const { data, error } = await supabase
            .from('forum_topics')
            .insert({
                category_id: categoryId,
                user_id: user.id,
                title,
                content
            })
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async updateTopic(topicId, title, content) {
        const { data, error } = await supabase
            .from('forum_topics')
            .update({ title, content, updated_at: new Date().toISOString() })
            .eq('id', topicId)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async deleteTopic(topicId) {
        const { error } = await supabase
            .from('forum_topics')
            .delete()
            .eq('id', topicId);

        if (error) throw error;
        return true;
    },

    // Posts
    async createPost(topicId, content) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Not authenticated');

        const { data, error } = await supabase
            .from('forum_posts')
            .insert({
                topic_id: topicId,
                user_id: user.id,
                content
            })
            .select('*')
            .single();

        if (error) throw error;
        return data;
    },

    async updatePost(postId, content) {
        const { data, error } = await supabase
            .from('forum_posts')
            .update({ content, updated_at: new Date().toISOString() })
            .eq('id', postId)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async deletePost(postId) {
        const { error } = await supabase
            .from('forum_posts')
            .delete()
            .eq('id', postId);

        if (error) throw error;
        return true;
    },

    async markAsSolution(postId, isSolution = true) {
        const { data, error } = await supabase
            .from('forum_posts')
            .update({ is_solution: isSolution })
            .eq('id', postId)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    // Likes
    async toggleLike(topicId = null, postId = null) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Not authenticated');

        // Check if already liked
        let query = supabase.from('forum_likes').select('id').eq('user_id', user.id);

        if (topicId) query = query.eq('topic_id', topicId);
        if (postId) query = query.eq('post_id', postId);

        const { data: existing } = await query.single();

        if (existing) {
            // Unlike
            await supabase.from('forum_likes').delete().eq('id', existing.id);
            return false;
        } else {
            // Like
            await supabase.from('forum_likes').insert({
                user_id: user.id,
                topic_id: topicId,
                post_id: postId
            });
            return true;
        }
    },

    async getLikeCounts(topicId) {
        const { count: topicLikes } = await supabase
            .from('forum_likes')
            .select('*', { count: 'exact', head: true })
            .eq('topic_id', topicId);

        return { topicLikes: topicLikes || 0 };
    },

    // Search
    async searchTopics(query, limit = 20) {
        try {
            const { data, error } = await supabase
                .from('forum_topics_with_profiles')
                .select('*')
                .or(`title.ilike.%${query}%,content.ilike.%${query}%`)
                .order('created_at', { ascending: false })
                .limit(limit);

            if (!error) return data || [];
        } catch (e) {
            // Fall through
        }

        // Fallback
        const { data, error } = await supabase
            .from('forum_topics')
            .select('*')
            .or(`title.ilike.%${query}%,content.ilike.%${query}%`)
            .order('created_at', { ascending: false })
            .limit(limit);

        if (error) throw error;
        return data || [];
    },

    // Recent activity
    async getRecentTopics(limit = 10) {
        try {
            const { data, error } = await supabase
                .from('forum_topics_with_profiles')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(limit);

            if (!error && data) {
                // Get categories for each topic
                const categoryIds = [...new Set(data.map(t => t.category_id))];
                const { data: categories } = await supabase
                    .from('forum_categories')
                    .select('id, name, slug, color')
                    .in('id', categoryIds);

                const categoryMap = (categories || []).reduce((acc, c) => ({ ...acc, [c.id]: c }), {});
                return data.map(t => ({ ...t, category: categoryMap[t.category_id] }));
            }
        } catch (e) {
            // Fall through
        }

        // Fallback
        const { data, error } = await supabase
            .from('forum_topics')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(limit);

        if (error) throw error;
        return data || [];
    },

    // Stats
    async getForumStats() {
        const { count: topicCount } = await supabase
            .from('forum_topics')
            .select('*', { count: 'exact', head: true });

        const { count: postCount } = await supabase
            .from('forum_posts')
            .select('*', { count: 'exact', head: true });

        return {
            topics: topicCount || 0,
            posts: postCount || 0
        };
    }
};

export default forumService;
