// user.model.ts
// Importing packages
import { Schema, model } from 'mongoose';

// Importing interfaces
import { IUser } from '../interfaces/models.interface';

const schema = new Schema<IUser>(
  {
    userId: {
      type: String,
      required: true
    },
    name: { type: String, required: true },
    email: { type: String, required: true },
    username: { type: String, required: false },
    password: { type: String, required: false },
    googleId: { type: String, resquired: false },
    profilePicture: { type: String, required: false },
    isManualAuth: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export default model<IUser>('user', schema);