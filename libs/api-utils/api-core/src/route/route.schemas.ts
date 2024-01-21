import { z } from 'zod';

export const routeInjectionKeySchema = z
  .string()
  .regex(/^(GET|POST|PUT|PATCH|DELETE) \/[\w-]+(\/:[\w-]+)?$/);
