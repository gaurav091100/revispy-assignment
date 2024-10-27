export function hideEmail(email: string): string {
    const atIndex = email.indexOf('@');
    if (atIndex < 3) {
        return email; // Not enough characters to hide
    }
    const hiddenPart = '***';
    const visiblePart = email.slice(3, atIndex); // Get the visible part of the email
    const domainPart = email.slice(atIndex); // Get the domain part
    return `${hiddenPart}${visiblePart}${domainPart}`;
}

// Example usage:
const email: string = 'dev***@revispy.com';
const hiddenEmail: string = hideEmail(email);
console.log(hiddenEmail); // Output: ***dev@revispy.com
