import { ObjectId } from "mongodb";
import express from "express";
import { getDB } from "../db/mongo.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { title, date } = req.body;

    if (!title || !date) {
      return res.status(400).json({ error: "Title and date are required" });
    }

    const db = getDB();

    const newEvent = {
      title,
      date,
      rsvps: [],
      createdAt: new Date(),
    };

    const result = await db.collection("events").insertOne(newEvent);

    res.status(201).json({
      _id: result.insertedId,
      ...newEvent,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

router.post("/:id/rsvp", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, status } = req.body;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid event ID" });
    }

    if (!name || !status) {
      return res.status(400).json({ error: "Name and status are required" });
    }

    if (!["yes", "no", "maybe"].includes(status)) {
      return res.status(400).json({ error: "Invalid RSVP status" });
    }

    const db = getDB();

    const updateResult = await db
      .collection("events")
      .findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $push: { rsvps: { name, status, createdAt: new Date() } } },
        { returnDocument: "after" },
      );

    if (!updateResult) {
      return res.status(404).json({ error: "Event not found", updateResult });
    }

    res.json(updateResult);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid event ID" });
    }

    const db = getDB();
    const event = await db
      .collection("events")
      .findOne({ _id: new ObjectId(id) });

    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    res.json(event);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

router.get("/", async (req, res) => {
  try {
    const db = getDB();
    const events = await db
      .collection("events")
      .find()
      .sort({ date: 1 })
      .limit(10)
      .toArray();
    res.json(events);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

export default router;
