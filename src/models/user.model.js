import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["cliente", "admin", "superadmin"], // solo puede tener uno de estos dos valores
      default: "cliente", // por defecto será cliente
    },
    address: {
      type: String, 
      required: true,
      trim: true
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("User", userSchema);
