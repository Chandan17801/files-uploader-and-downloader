const mongoose = require("mongoose");
const { Schema } = mongoose;

const UserSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, unique: true },
    password: { type: String, required: true },
    passwordChanged: { type: Boolean, default: false },
    userType: {
      type: String,
      enum: ["admin", "user", "shared"],
      required: true,
    },
    sharedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    expiryDate: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model("User", UserSchema);

module.exports = User;
