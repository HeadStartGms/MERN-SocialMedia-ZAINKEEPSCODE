import mongoose from "mongoose";

const UserSchema = mongoose.Schema(
  {
    firstname: { type: String, required: [true, "First name is required"] },
    lastname: { type: String, required: [true, "Last name is required"] },
    username: { 
      type: String, 
      required: [true, "Username is required"],
      unique: true,
      minlength: [3, "Username must be at least 3 characters"]
    },
    password: { 
      type: String, 
      required: [true, "Password is required"],
      minlength: [4, "Password must be at least 4 characters"]
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    profilePicture: String,
    coverPicture: String,
    about: String,
    livesIn: String,
    worksAt: String,
    relationship: String,
    country: String,
    followers: [],
    following: [],
  },
  { timestamps: true }
);

const UserModel = mongoose.model("Users", UserSchema);
export default UserModel;