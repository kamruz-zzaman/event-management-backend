const express = require("express");
const { createEvent, getAllEvents, getEventById, updateEvent, deleteEvent } = require("../controllers/eventController");
const router = express.Router();

router.post("/create", createEvent);
router.get("/", getAllEvents);
router.get("/:id", getEventById);
router.put("/update/:id", updateEvent);
router.delete("/delete/:id", deleteEvent);

module.exports = router;
