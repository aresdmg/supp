import { IUser } from "@/models/user.models";
import jwt from "jsonwebtoken"

export const getAccessAndRefreshToken = async (user: IUser) => {
    const accessSecret = process.env.ACCESS_SECRET
    const refreshSecret = process.env.REFRESH_SECRET
    if (!accessSecret || !refreshSecret) {
        throw new Error("Access or Refresh secret is missing. Check .env")
    }

    const accessToken = jwt.sign(
        {
            userId: user?._id,
            fullName: user?.fullName
        },
        accessSecret,
        {
            expiresIn: "1d"
        }
    )

    const refreshToken = jwt.sign(
        {
            userId: user?._id,
        },
        refreshSecret,
        {
            expiresIn: "30d"
        }
    )
    return { accessToken, refreshToken }
}