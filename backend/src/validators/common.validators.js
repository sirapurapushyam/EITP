import { z } from 'zod';

export const idParamSchema = z.object({ id: z.string().min(1) });

export const paginationQuerySchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  sort: z.string().optional(),
  search: z.string().optional(),
  filter: z.string().optional()
});
