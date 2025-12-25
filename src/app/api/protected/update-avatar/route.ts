import { ExtendedResposne } from "@/lib/response";
import chalk from "chalk";
import { NextRequest } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken"
import { ObjectId } from "mongoose";
import connectDB from "@/lib/database";
import { User } from "@/models/user.models";
import cloudinary from "@/lib/cloudinary";
import { cookies } from "next/headers";

interface SuppPayload extends JwtPayload {
    userId?: ObjectId
}

export async function POST(request: NextRequest) {
    try {
        await connectDB()
        const cookieStore = cookies();
        const accessToken = (await cookieStore).get("accessToken")?.value;

        if (!accessToken) {
            return ExtendedResposne.error(401, "Unauthorized access")
        }

        const accessSecret = process.env.ACCESS_SECRET
        if (!accessSecret) {
            console.log(chalk.bgRed("ACCESS_SECRET is missing"))
            return
        }

        const decodeToken = jwt.verify(accessToken, accessSecret) as SuppPayload
        const userId = decodeToken?.userId
        if (!userId) {
            return ExtendedResposne.error(401, "Invalid token")
        }

        const formdata = await request.formData()

        const file = formdata.get("avatar") as File | null
        if (!file) {
            return ExtendedResposne.error(400, "Avatar file is missing")
        }

        console.log("File recieved");

        const byte = await file.arrayBuffer()
        const base64 = Buffer.from(byte).toString("base64")
        const dataUri = `data:${file.type};base64,${base64}`;

        const results = await cloudinary.uploader.upload(dataUri, { resource_type: "image", folder: "Supp_images" })

        await User.findByIdAndUpdate(
            userId,
            {
                $set: { 
                    avatar: results.secure_url,
                    newAcc: false
                }
            },
            {
                new: true
            }
        )

        return ExtendedResposne.success(200, {}, "Image updated")
    } catch (error) {
        console.log(chalk.bgYellow("ERROR: Failed to upload image \n") + error);
        return ExtendedResposne.error(500, "Failed to upload image")
    }
}