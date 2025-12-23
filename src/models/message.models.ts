import { Document, model, Model, models, ObjectId, Schema } from "mongoose";

export interface IMessage extends Document {
    content: string,
    sentBy: ObjectId
}

const messageSchema: Schema<IMessage> = new Schema({
    content: {
        type: String,
        required: true,
    },
    sentBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    }
}, { timestamps: true, versionKey: false })

export const Message = (models.Message as Model<IMessage>) || model<IMessage>("Message", messageSchema)