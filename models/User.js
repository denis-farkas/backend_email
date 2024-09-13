import mongoose from "mongoose";
import bcrypt from "bcrypt";

//structure of the database
//schema maps to a MongoDB collection and defines the shape
// of the documents within that collection.

const userSchema = mongoose.Schema(
  {
    firstname: {
      type: String,
      trim: true,
    },

    lastname: {
      type: String,
      trim: true,
    },

    email: {
      type: String,
      trim: true,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      trim: true,
    },

    token: {
      type: String,
    },

    confirm: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = bcrypt.hash(this.password, salt);
});

userSchema.methods.verifyPassword = async function (passwordForm) {
  return await bcrypt.compare(passwordForm, this.password);
};

const User = mongoose.model("User", userSchema);
export default User;
