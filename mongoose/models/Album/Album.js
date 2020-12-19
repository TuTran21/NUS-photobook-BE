import mongoose from "mongoose";
import mongodb from "mongodb";
const { ObjectID } = mongodb;

const Schema = mongoose.Schema;

ObjectID.prototype.valueOf = function () {
  return this.toString();
};

const AlbumSchema = new Schema({
  images: [
    {
      url: {
        type: String,
      },
    },
  ],
  title: {
    type: String,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  description: {
    type: String,
  },
  likes: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    },
  ],
  isPublic: {
    type: Boolean,
    default: true,
  },
});

export default mongoose.model("Album", AlbumSchema);
