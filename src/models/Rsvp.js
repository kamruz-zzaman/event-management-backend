const mongoose = require("mongoose");
const RsvpSchema = new mongoose.Schema(
  {
    user_id: {
      type: String,
      required: true,
    },
    event_id: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Rsvp = mongoose.model("Rsvps", RsvpSchema);

module.exports = Rsvp;
