export type AvailablePetsResponse = {
  id?: number;
  category?: { id?: number; name?: string };
  name: string;
  images: string[];
  status?: 'available' | 'pending' | 'sold';
}[];
