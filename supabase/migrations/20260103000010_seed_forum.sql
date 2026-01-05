-- Seed Forum Categories
INSERT INTO public.forum_categories (name, slug, description, sort_order)
VALUES 
    ('General Discussion', 'general', 'General discussions about peptides and research.', 10),
    ('Peptide Reviews', 'reviews', 'User reviews and experiences with specific peptides.', 20),
    ('Protocols & Dosing', 'protocols', 'Discussion of research protocols and dosing regimens.', 30),
    ('Sources & Vendors', 'sources', 'Discussion about vendors, sources, and testing.', 40)
ON CONFLICT (slug) DO UPDATE 
SET description = EXCLUDED.description;

-- Seed Topics (Welcome)
INSERT INTO public.forum_topics (category_id, user_id, title, content, is_pinned, is_locked, created_at)
SELECT 
    (SELECT id FROM public.forum_categories WHERE slug = 'general'),
    (SELECT id FROM public.profiles LIMIT 1),
    'Welcome to the Peptide Community!',
    'Welcome researchers! This community is dedicated to sharing knowledge and experiences.',
    true,
    true,
    NOW()
WHERE EXISTS (SELECT 1 FROM public.profiles LIMIT 1)
AND NOT EXISTS (SELECT 1 FROM public.forum_topics WHERE title = 'Welcome to the Peptide Community!');

-- Seed Topics (Protocols)
INSERT INTO public.forum_topics (category_id, user_id, title, content, is_pinned, is_locked, created_at)
SELECT 
    (SELECT id FROM public.forum_categories WHERE slug = 'protocols'),
    (SELECT id FROM public.profiles LIMIT 1),
    'Read This First: Safety & Research Protocols',
    'Safety is paramount. Please read these guidelines before posting about protocols.',
    true,
    true,
    NOW()
WHERE EXISTS (SELECT 1 FROM public.profiles LIMIT 1)
AND NOT EXISTS (SELECT 1 FROM public.forum_topics WHERE title = 'Read This First: Safety & Research Protocols');

-- Seed Topics (Sources)
INSERT INTO public.forum_topics (category_id, user_id, title, content, is_pinned, is_locked, created_at)
SELECT 
    (SELECT id FROM public.forum_categories WHERE slug = 'sources'),
    (SELECT id FROM public.profiles LIMIT 1),
    'Vendor Vetting and Testing Standards',
    'How we vet vendors and what testing standards are required.',
    true,
    false,
    NOW()
WHERE EXISTS (SELECT 1 FROM public.profiles LIMIT 1)
AND NOT EXISTS (SELECT 1 FROM public.forum_topics WHERE title = 'Vendor Vetting and Testing Standards');

-- Seed Topics (General Chat)
INSERT INTO public.forum_topics (category_id, user_id, title, content, is_pinned, is_locked, created_at)
SELECT 
    (SELECT id FROM public.forum_categories WHERE slug = 'general'),
    (SELECT id FROM public.profiles LIMIT 1),
    'Introduce Yourself!',
    'New to the community? Say hello here!',
    false,
    false,
    NOW()
WHERE EXISTS (SELECT 1 FROM public.profiles LIMIT 1)
AND NOT EXISTS (SELECT 1 FROM public.forum_topics WHERE title = 'Introduce Yourself!');

-- Seed Welcome Post
INSERT INTO public.forum_posts (topic_id, user_id, content, created_at)
SELECT 
    (SELECT id FROM public.forum_topics WHERE title = 'Welcome to the Peptide Community!' LIMIT 1),
    (SELECT id FROM public.profiles LIMIT 1),
    'Welcome researchers! This community is dedicated to sharing knowledge, experiences, and data about peptide research. Please stay respectful and follow the guidelines.',
    NOW()
WHERE EXISTS (SELECT 1 FROM public.profiles LIMIT 1)
AND EXISTS (SELECT 1 FROM public.forum_topics WHERE title = 'Welcome to the Peptide Community!')
AND NOT EXISTS (SELECT 1 FROM public.forum_posts WHERE content LIKE 'Welcome researchers%');
