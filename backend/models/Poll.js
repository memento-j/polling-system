import { Schema, model } from "mongoose";

const pollSchema = new Schema({
  question: {
    type: String,
    required: true,
  },
  deadline: {
    type: Date,
    required: true,
  },
  options: {
    type: Object,
    required: true,
  },
  isPrivate: {
    type: Boolean,
    required: true
  },
  owner: {
    type: String,
  }
});

export const Poll = model("Poll", pollSchema);
