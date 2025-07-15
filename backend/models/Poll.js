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
});

export const Poll = model("Poll", pollSchema);
