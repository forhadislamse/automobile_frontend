import { z } from "zod";

export const shopSetupSchema = z
  .object({
    ownerName: z.string().min(1, "Owner name is required"),
    shopName: z.string().min(1, "Shop name is required"),
    shopAddress: z.string().min(1, "Shop address is required"),
    phoneNumber: z.string().min(1, "Phone number is required"),
    email: z.string().email("Invalid email format"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
    acceptTerms: z.boolean().refine((val) => val === true, {
      message: "You must accept the terms",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type ShopSetupFormValues = z.infer<typeof shopSetupSchema>;
