export type ListAvailablePetsResponse = {
  id?: number;
  category?: { id?: number; name?: string };
  name: string;
  images: string[];
  status?: 'available' | 'pending' | 'sold';
}[];
