import { z } from 'zod';

export const paramsSchema = z.object({
  id: z.string().transform(Number),
});

export type GetPetByIdParams = z.infer<typeof paramsSchema>;

export type GetPetByIdResponse = {
  id?: number;
  category?: { id?: number; name?: string };
  name: string;
  images: string[];
  status?: 'available' | 'pending' | 'sold';
};
