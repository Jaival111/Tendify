export const validateName = (name: string): string => {
    if (!name) {
        return 'Name is required';
    }

    if (name.length < 2) {
        return 'Name must be at least 2 characters long';
    }

    if (!/^[a-zA-Z\s'-]+$/.test(name)) {
        return 'Name can only contain letters, spaces, hyphens, and apostrophes';
    }

    return '';
};

export const validateEmail = (email: string): string => {
    if (!email) {
        return 'Email is required';
    }

    // Simple regex for email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return 'Please enter a valid email address';
    }

    return '';
};

export const validatePassword = (password: string): string => {
    if (!password) {
        return 'Password is required';
    }

    if (password.length < 8) {
        return 'Password must be at least 8 characters long';
    }

    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);

    if (!hasUpper || !hasLower || !hasNumber) {
        return 'Password must include uppercase, lowercase, and numbers';
    }

    return '';
};