import mongoose from "mongoose";
import mongodb from "mongodb";
const { ObjectID } = mongodb;

const Schema = mongoose.Schema;

ObjectID.prototype.valueOf = function () {
  return this.toString();
};

const PhotoSchema = new Schema({
  image: {
    url: {
      type: String,
      required: true,
    }
  },
  title: {
    type: String,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  description: {
    type: Schema.Types.ObjectId,
    ref: "Post",
  },
  likes: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: "User",
      }
    }
  ],
  isPublic: {
    type: Boolean,
    default: true
  }
});

export default mongoose.model("Photo", PhotoSchema);
