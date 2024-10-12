import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  username: string;
  email: string;
  access_token?: string;  // Optional field to store access token
}

const UserSchema: Schema = new Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  access_token: { type: String },  // Store the token
});

export default mongoose.model<IUser>('User', UserSchema);
