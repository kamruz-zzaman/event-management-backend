const Event = require("../models/Event");

// Create a new event
const createEvent = async (req, res) => {
    try {
        const event = new Event(req.body);
        await event.save();
        res.status(201).json({ success: true, event: event });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get all events with pagination and search
const getAllEvents = async (req, res) => {
    try {
        // Pagination
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        // Search criteria
        const searchQuery = {};
        let events;
        let totalEvents;
        if (req.query.search) {
            const searchRegex = new RegExp(req.query.search, 'i');
            searchQuery.$or = [
                { title: searchRegex },
                { location: searchRegex },
            ];
            // Fetch events with pagination and search
            events = await Event.find(searchQuery).skip(skip).limit(limit);
            totalEvents = await Event.countDocuments(searchQuery);
        }

        else if (req.query.startDate != 'null' && req.query.endDate != 'null') {
            searchQuery.$or = searchQuery.$or || [];
            searchQuery.$or.push({
                $and: [
                    { start_time: { $gte: req.query.startDate || '1970-01-01T00:00:00Z' } },
                    { end_time: { $lte: req.query.endDate || '2100-01-01T00:00:00Z' } },
                ],
            });
            events = await Event.find(searchQuery).skip(skip).limit(limit);
            totalEvents = await Event.countDocuments(searchQuery);

        }
        else {
            events = await Event.find().skip(skip).limit(limit);
            totalEvents = await Event.countDocuments();
        }


        res.status(200).json({
            data: {
                events: events,
                currentPage: page,
                totalPages: Math.ceil(totalEvents / limit),
                totalEvents: totalEvents,
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};



// Get a single event by ID
const getEventById = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }
        res.status(200).json(event);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update an event by ID
const updateEvent = async (req, res) => {
    try {
        const event = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }
        res.status(200).json(event);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete an event by ID
const deleteEvent = async (req, res) => {
    try {
        const event = await Event.findByIdAndDelete(req.params.id);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }
        res.status(204).end();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateRsvp = async (req, res) => {
    try {
        const eventId = req.params.eventId;
        const { userId, rsvpStatus } = req.body;

        // Find the event by ID
        const event = await Event.findById(eventId);
        console.log(event);
        if (!event) {
            return res.status(404).json({ error: 'Event not found' });
        }

        // Update RSVP status
        if (rsvpStatus === 'attend') {
            event.rsvp.push(userId);
        } else if (rsvpStatus === 'cancel') {
            event.rsvp = event.rsvp.filter(id => id !== userId);
        } else {
            return res.status(400).json({ error: 'Invalid RSVP status' });
        }

        // Save the updated event
        await event.save();

        return res.json({ message: 'RSVP updated successfully', event });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = {
    createEvent,
    getAllEvents,
    getEventById,
    updateEvent,
    deleteEvent,
    updateRsvp
};