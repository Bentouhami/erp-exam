// path: src/lib/password-strength.ts
export function checkPasswordStrength(password: string): number {
    let strength = 0;

    // Length check (minimum 8 characters)
    if (password.length >= 8) strength += 10;

    // Contains number
    if (/\d/.test(password)) strength += 20;

    // Contains lowercase letter
    if (/[a-z]/.test(password)) strength += 20;

    // Contains uppercase letter
    if (/[A-Z]/.test(password)) strength += 20;

    // Contains special character
    if (/[!@#$%^&*(),.?":{}|<>+\-]/.test(password)) strength += 20;

    if(strength > 80 && password.length >= 8) {
        strength += 10;
    } else if(strength >= 50 && password.length < 8) {
        strength = 20;
    }
    return strength;
}

// path: src/lib/password-strength.ts
export function getStrengthColor(strength: number): string {
    console.log("log ===> strength in getStrengthColor", strength);
    if (strength <= 20) return 'bg-red-500';        // Rouge pour faible
    if (strength <= 60) return 'bg-yellow-500';        // Rouge pour moyen
    if (strength <= 80) return 'bg-orange-500';     // Orange pour bon
    return 'bg-green-600';                          // Vert pour fort
}