export type CreatePropertyInput = {
  propertyTitle: string;
  propertyDescription: string;
  propertyType: string;
  askingPriceMonthly: number;
  beds: number;
  baths: number;
  totalSqft: number;
  streetAddress: string;
  city: string;
  zipCode: string;
  listingHighlights?: string[];
};
