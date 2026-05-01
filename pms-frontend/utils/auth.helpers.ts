
export const getPasswordStrength = (password: string) => {
    if (password.length === 0) return 0;
    if (password.length >= 8 && /[A-Z]/.test(password) && /[0-9]/.test(password) && /[^A-Za-z0-9]/.test(password)) {
        return 4; // Strong
    }
    if (password.length >= 8 && /[A-Z]/.test(password) && /[0-9]/.test(password)) {
        return 3; // Good
    }
    if (password.length >= 6) {
        return 2; // Fair
    }
    return 1; // Weak
};

export const checkPasswordRequirements = (password: string) => {
    return {
        isLengthValid: password.length >= 8,
        isUppercaseValid: /[A-Z]/.test(password),
        isNumberSymbolValid: /[0-9!@#$%^&*(),.?":{}|<>]/.test(password),
    };
};


export const maskEmail = (email: string) => {
    const [name, domain] = email.split('@');
    if (!name || !domain) return email;
    return `${name[0]}***@${domain}`;
};
