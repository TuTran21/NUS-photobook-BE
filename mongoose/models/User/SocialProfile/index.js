import mongoose from "mongoose";
import mongodb from "mongodb";
const { ObjectID } = mongodb;

const Schema = mongoose.Schema;

ObjectID.prototype.valueOf = function () {
  return this.toString();
};

const UserSocialProfileSchema = new Schema({
  id: Schema.Types.ObjectId,
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },
  rpg: {
    experience: {
      type: Number,
      default: 0,
    },
    title: { type: String, default: "Novice" },
    level: {
      type: Number,
      default: 0,
    },
  },
  wall: {
    posts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "SocialPost",
        default: null,
      },
    ],
  },
});

export default mongoose.model("UserSocialProfile", UserSocialProfileSchema);
