export type Listing = {
  id: string;
  title: string;
  description: string | null;
  price: number;
  category: string;
  seller_email: string;
  image_url: string | null;
  location: string | null;
  created_at: string;
  updated_at: string;
};

export const CATEGORIES = [
  "All",
  "Electronics",
  "Furniture",
  "Clothing",
  "Vehicles",
  "Home & Garden",
  "Sports",
  "Books",
  "Others",
] as const;
