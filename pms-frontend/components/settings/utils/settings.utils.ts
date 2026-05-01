/**
 * Gets the initials from a user's name (e.g., "John Doe" -> "JD").
 * @param name The full name of the user.
 * @returns A 2-character string of initials in uppercase.
 */
export const getInitials = (name?: string): string => {
    if (!name) return "U";
    return name
        .trim()
        .split(/\s+/)
        .map((n) => n[0])
        .join("")
        .substring(0, 2)
        .toUpperCase();
};

/**
 * Generates the full S3 URL for a profile picture or returns the URL as is if it's external.
 * @param pictureKey The S3 key or external URL.
 * @returns The full path to the image.
 */
export const getProfilePictureUrl = (pictureKey?: string | null): string | null => {
    if (!pictureKey) return null;
    if (pictureKey.startsWith('http')) return pictureKey;
    
    const bucket = process.env.NEXT_PUBLIC_AWS_S3_BUCKET;
    const region = process.env.NEXT_PUBLIC_AWS_S3_REGION;
    
    return `https://${bucket}.s3.${region}.amazonaws.com/${pictureKey}`;
};
