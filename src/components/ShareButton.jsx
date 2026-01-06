/**
 * ShareButton - Wrapper for backward compatibility
 * Use SocialShare for new implementations
 */
import SocialShare from './SocialShare';

const ShareButton = ({ title, text, url, className = '' }) => {
    return (
        <SocialShare
            title={title}
            description={text}
            url={url}
            className={className}
            variant="button"
            size="md"
        />
    );
};

export default ShareButton;
