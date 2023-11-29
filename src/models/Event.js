const mongoose = require("mongoose");
const EventSchema = new mongoose.Schema(
  {
    user_id: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    start_time: {
      type: String,
      required: true,
    },
    end_time: {
      type: String,
      required: true
    },
    location: {
      type: String,
      required: true,
    },
    rsvp: {
      type: Array,
      required: false,
      default: []
    },
  },
  {
    timestamps: true,
  }
);

const Event = mongoose.model("Events", EventSchema);

module.exports = Event;
