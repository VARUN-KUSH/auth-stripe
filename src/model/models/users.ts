// lib/models/User.js
import mongoose from 'mongoose';
import { model, models } from 'mongoose';
const UserSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, 'Please provide a username'],
    unique: true,
  },
  email: {
    type: String,
    required: [true, 'Please provide a email'],
    unique: true,
  },
  hashedPassword: {
    type: String,
    required: [true, 'Please provide a password'],
  },
  subscription: {
    type: Boolean,
    default: false,
  },
  resetToken: {
    type: String,
    default: null,  // This field will store the reset token
  },
  resetTokenExpiration: {
    type: Date,
    default: null,   // This field will store the expiration time of the token
  },
});

const User = models.User || model('User', UserSchema);

export default User;
