import * as z from "zod"

export const userSchema = z.object({
    fullName: z.string().min(1, "Full name cannot be empty").optional(),
    email: z.email().min(1, "Email cannot be empty"),
    password: z.string().min(1, "Password is required")
})

export type UserSchema = z.infer<typeof userSchema>