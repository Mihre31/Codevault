import mongoose from "mongoose";

const snippetSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    snippetCollection: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Collection",
      default: null,
      index: true,
    },
    description: {
      type: String,
      default: "",
      trim: true,
    },
    language: {
      type: String,
      required: true,
      trim: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    favorite: {
      type: Boolean,
      default: false,
    },
    code: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform(doc, ret) {
        ret.collection = ret.snippetCollection;
        delete ret.snippetCollection;
        return ret;
      },
    },
    toObject: { virtuals: true },
  },
);

const Snippet = mongoose.model("Snippet", snippetSchema);

export default Snippet;
