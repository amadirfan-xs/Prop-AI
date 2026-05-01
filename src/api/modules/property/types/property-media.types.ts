/** Stored in property.property_media JSON column (array of items). */
export type PropertyMediaKeys = {
  originalKey: string;
};

/** Response shape with presigned URL for the original image only. */
export type PropertyMediaWithSignedUrls = {
  originalKey: string;
  signedUrl: string | null;
};
