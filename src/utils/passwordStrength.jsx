/**
 * Password Strength Utility
 * Calculates password strength and provides feedback
 */

export const calculatePasswordStrength = (password) => {
    if (!password) {
        return { score: 0, label: '', color: '', feedback: [] };
    }

    let score = 0;
    const feedback = [];

    // Length checks
    if (password.length >= 6) score += 1;
    if (password.length >= 8) score += 1;
    if (password.length >= 12) score += 1;
    if (password.length >= 16) score += 1;

    // Character type checks
    if (/[a-z]/.test(password)) {
        score += 1;
    } else {
        feedback.push('Add lowercase letters');
    }

    if (/[A-Z]/.test(password)) {
        score += 1;
    } else {
        feedback.push('Add uppercase letters');
    }

    if (/[0-9]/.test(password)) {
        score += 1;
    } else {
        feedback.push('Add numbers');
    }

    if (/[^a-zA-Z0-9]/.test(password)) {
        score += 1;
    } else {
        feedback.push('Add special characters (!@#$%^&*)');
    }

    // Penalty for common patterns
    const commonPatterns = [
        /^123/,
        /password/i,
        /qwerty/i,
        /abc123/i,
        /letmein/i,
        /welcome/i,
        /admin/i,
        /111111/,
        /123456/
    ];

    if (commonPatterns.some(pattern => pattern.test(password))) {
        score = Math.max(0, score - 3);
        feedback.push('Avoid common passwords');
    }

    // Sequential characters penalty
    if (/(.)\1{2,}/.test(password)) {
        score = Math.max(0, score - 1);
        feedback.push('Avoid repeated characters');
    }

    // Determine strength level
    let label, color;
    if (score <= 2) {
        label = 'Weak';
        color = '#ef4444'; // red
    } else if (score <= 4) {
        label = 'Fair';
        color = '#f97316'; // orange
    } else if (score <= 6) {
        label = 'Good';
        color = '#eab308'; // yellow
    } else if (score <= 7) {
        label = 'Strong';
        color = '#22c55e'; // green
    } else {
        label = 'Excellent';
        color = '#10b981'; // emerald
    }

    // Normalize score to 0-100 for progress bar
    const percentage = Math.min(100, (score / 8) * 100);

    return {
        score,
        percentage,
        label,
        color,
        feedback: feedback.slice(0, 2), // Show max 2 suggestions
        isValid: password.length >= 8 && score >= 4
    };
};

/**
 * Password Strength Meter Component
 */
export const PasswordStrengthMeter = ({ password }) => {
    const strength = calculatePasswordStrength(password);

    if (!password) return null;

    return (
        <div style={{ marginTop: '0.5rem' }}>
            {/* Progress bar */}
            <div style={{
                height: '4px',
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '2px',
                overflow: 'hidden',
                marginBottom: '0.5rem'
            }}>
                <div style={{
                    height: '100%',
                    width: `${strength.percentage}%`,
                    background: strength.color,
                    transition: 'width 0.3s, background 0.3s',
                    borderRadius: '2px'
                }} />
            </div>

            {/* Strength label and feedback */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontSize: '0.75rem'
            }}>
                <span style={{ color: strength.color, fontWeight: '500' }}>
                    {strength.label}
                </span>
                {strength.feedback.length > 0 && (
                    <span style={{ color: 'var(--text-tertiary)' }}>
                        {strength.feedback[0]}
                    </span>
                )}
            </div>
        </div>
    );
};

export default PasswordStrengthMeter;
