import { Document, Model, model, models, Schema } from "mongoose"

export interface IUser extends Document {
    fullName: string,
    email: string,
    password: string,
    refreshToken: string,
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
    refreshToken: {
        type: String
    },
    isDeleted: {
        type: Boolean,
        required: true,
        default: false
    }
}, { timestamps: true, versionKey: false })

export const User = (models.User as Model<IUser>) || model<IUser>("User", userSchema) 