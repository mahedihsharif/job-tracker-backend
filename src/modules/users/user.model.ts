import { model, Schema } from "mongoose";
import bcrypt from "bcrypt";
import env from "../../config/env.config";
import { IUser } from "./user.types";

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: { type: String, required: true, trim: true, select: false },
  },
  { versionKey: false },
);

// ─── Pre-save hook — hash password before saving ──────────────────
userSchema.pre("save", async function () {
  if (this.isModified("password") && this.password) {
    this.password = await bcrypt.hash(this.password, env.BCRYPT_SALT_ROUND);
  }
});

export const User = model<IUser>("User", userSchema);
