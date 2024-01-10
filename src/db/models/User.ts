import mongoose from "mongoose";

const publicKeySchema = new mongoose.Schema({
    type: { type: String, required: true, enum: ['Buffer'] },
    data: { type: [Number], required: true }
});

const secretKeySchema = new mongoose.Schema({
    type: { type: String, required: true, enum: ['Buffer'] },
    data: { type: [String], required: true } // Или [Number], в зависимости от ваших данных
});

export interface UserInterface extends mongoose.Document {
    username: string;
    chatId: number;
    secretKey: typeof secretKeySchema;
    publicKey: typeof publicKeySchema;
    mnemonics: string[];
    walletAddress: string;
}

const UserSchema = new mongoose.Schema<UserInterface>({
    username: { type: String, required: true },
    chatId: { type: Number, required: true },
    secretKey: { type: secretKeySchema, required: true },
    publicKey: { type: publicKeySchema, required: true },
    mnemonics: { type: [String], required: true },
    walletAddress: { type: String, required: true },
});

export const User = mongoose.model<UserInterface>('User', UserSchema);