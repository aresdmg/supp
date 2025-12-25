import { Document, Model, model, models, Schema } from "mongoose"

export interface IUser extends Document {
    fullName: string,
    email: string,
    password: string,
    avatar: string,
    refreshToken: string,
    newAcc: boolean,
    isDeleted: boolean
}

const userSchema: Schema<IUser> = new Schema({
    fullName: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        indexes: true
    },
    password: {
        type: String,
        required: true
    },
    avatar: {
        type: String,
        required: true,
        default: "https://res.cloudinary.com/desamhhkj/image/upload/v1766655479/Tik_tok_profile_picture_erpml0.jpg"
    },
    refreshToken: {
        type: String
    },
    newAcc: {
        type: Boolean,
        default: true,
        required: true
    },
    isDeleted: {
        type: Boolean,
        required: true,
        default: false
    }
}, { timestamps: true, versionKey: false })

export const User = (models.User as Model<IUser>) || model<IUser>("User", userSchema) 