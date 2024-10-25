import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  username: string;
  email: string;
  image?: string;
  access_token?: string;  
  jira_instance_url: string;
}

const UserSchema: Schema = new Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  image: { type: String },
  access_token: { type: String },  
  jira_instance_url: { type: String},
});

export default mongoose.model<IUser>('User', UserSchema);
