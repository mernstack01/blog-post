import { z } from 'zod';

export const createListingSchema = z.object({
  title: z
    .string()
    .min(5, 'Sarlavha kamida 5 ta belgidan iborat bo\'lishi kerak')
    .max(120, 'Sarlavha 120 ta belgidan oshmasligi kerak'),
  name: z
    .string()
    .min(2, 'Ism yoki kompaniya nomi kamida 2 ta belgidan iborat bo\'lishi kerak'),
  description: z
    .string()
    .min(20, 'Tavsif kamida 20 ta belgidan iborat bo\'lishi kerak'),
  phone: z
    .string()
    .min(9, 'Telefon raqam kamida 9 ta raqam bo\'lishi kerak')
    .regex(
      /^(\+?998)?[0-9\s\-()]{9,15}$/,
      'Noto\'g\'ri telefon raqam formati. Masalan: +998901234567'
    ),
  telegram: z.string().optional().or(z.literal('')),
  instagram: z.string().optional().or(z.literal('')),
  websiteUrl: z.string().optional().or(z.literal('')),
  location: z
    .string()
    .min(2, 'Iltimos, hududni tanlang'),
  regionId: z.string().optional().or(z.literal('')),
  districtId: z.string().optional().or(z.literal('')),
  address: z.string().optional().or(z.literal('')),
  price: z.string().optional().or(z.literal('')),
  experience: z.string().optional().or(z.literal('')),
  categoryId: z
    .string()
    .min(1, 'Iltimos, asosiy kategoriyani tanlang'),
  subCategoryId: z.string().optional().or(z.literal('')),
  images: z
    .array(
      z
        .string()
        .refine(
          (url) =>
            /^https?:\/\//i.test(url) ||
            /^\/uploads\//i.test(url) ||
            /^data:image\//i.test(url),
          {
            message: "Rasm formati noto'g'ri (http://, https://, /uploads/ yoki yuklangan rasm bo'lishi kerak)",
          }
        )
    )
    .optional()
    .default([]),
});

export type CreateListingInput = z.infer<typeof createListingSchema>;

export const listingFilterSchema = z.object({
  q: z.string().optional(),
  location: z.string().optional(),
  category: z.string().optional(),
  subCategory: z.string().optional(),
  sortBy: z.enum(['popular', 'newest', 'rating']).optional().default('popular'),
  mode: z.enum(['all', 'top10']).optional().default('all'),
});

export type ListingFilterParams = z.infer<typeof listingFilterSchema>;
