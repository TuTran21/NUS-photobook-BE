import mongoose from "mongoose";
import mongodb from "mongodb";
const { ObjectID } = mongodb;

const Schema = mongoose.Schema;

ObjectID.prototype.valueOf = function () {
  return this.toString();
};

const UserSocialPost = new Schema(
  {
    id: Schema.Types.ObjectId,
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    content: String,
    reaction: {
      likes: { amount: Number },
    },
  },
  { timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" } }
);

export default mongoose.model("SocialPost", UserSocialPost);
