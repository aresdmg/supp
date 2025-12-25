import { ExtendedResposne } from "@/lib/response";
import { User } from "@/models/user.models";
import { NextRequest } from "next/server";
import bcrypt from "bcrypt"
import chalk from "chalk";
import connectDB from "@/lib/database";

export async function POST(request: NextRequest) {
    const { fullName, email, password } = await request.json()
    if (!(fullName && email && password)) {
        return ExtendedResposne.error(400, "All fields")
    }

    try {
        await connectDB()

        const existingUser = await User.findOne({ email })
        if (existingUser) {
            return ExtendedResposne.error(400, "This email is taken")
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const user = await User.create({
            fullName,
            email,
            password: hashedPassword,
        })

        const createdUser = await User.findById(user?._id).select(
            "-password -refreshToken"
        )

        return ExtendedResposne.success(201, createdUser, "User created")
    } catch (error) {
        console.log(chalk.bgYellow("ERROR: Failed to register user \n") + error);
        return ExtendedResposne.error(500, "Failed to register user", error)
    }
}