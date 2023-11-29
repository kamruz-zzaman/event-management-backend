const express = require("express");
const { createEvent, getAllEvents, getEventById, updateEvent, deleteEvent, updateRsvp } = require("../controllers/eventController");
const checkLogin = require("../middleware/checkLogin");
const router = express.Router();

router.post("/create", checkLogin, createEvent);
router.get("/", getAllEvents);
router.get("/:id", getEventById);
router.patch("/update/:id", checkLogin, updateEvent);
router.delete("/delete/:id", checkLogin, deleteEvent);
router.put("/update-rsvp/:eventId", checkLogin, updateRsvp);

module.exports = router;
