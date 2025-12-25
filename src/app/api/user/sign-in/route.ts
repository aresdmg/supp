import connectDB from "@/lib/database";
import { ExtendedResposne } from "@/lib/response";
import { User } from "@/models/user.models";
import { NextRequest } from "next/server";
import bcrypt from "bcrypt"
import { getAccessAndRefreshToken } from "@/lib/token";
import { cookies } from "next/headers";
import chalk from "chalk";

export async function POST(request: NextRequest) {
    const { email, password } = await request.json()
    if (!(email && password)) {
        return ExtendedResposne.error(400, "All fields required")
    }

    try {
        await connectDB()

        const user = await User.findOne({ email })
        if (!user) {
            return ExtendedResposne.error(404, "User not found")
        }

        const isValidPass = await bcrypt.compare(password, user.password)
        if (!isValidPass) {
            return ExtendedResposne.error(400, "Invalid credentials")
        }

        const { accessToken, refreshToken } = await getAccessAndRefreshToken(user)
        await User.findByIdAndUpdate(
            user?._id,
            {
                $set: { refreshToken }
            },
            {
                new: true
            }
        )

        const cookieStore = await cookies()
        cookieStore.set("accessToken", accessToken, { secure: true, httpOnly: true, maxAge: 60 * 60 * 24 * 1 })
        cookieStore.set("refreshToken", refreshToken, { secure: true, httpOnly: true, maxAge: 60 * 60 * 24 * 30 })

        return ExtendedResposne.success(200, {}, "User logged in")
    } catch (error) {
        console.log(chalk.bgYellow("ERROR: Failed to login user \n") + error);
        return ExtendedResposne.error(500, "Failed to login user", error)
    }
}