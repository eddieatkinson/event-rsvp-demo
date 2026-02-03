import { connectDB } from "./db/mongo.js";
import cors from "cors";
import dotenv from "dotenv";
import eventsRouter from "./routes/events.js";
import express from "express";

dotenv.config();

const app = express();
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
  }),
);

app.use(express.json());

await connectDB();

app.use("/events", eventsRouter);

app.get("/health", (req, res) => {
  res.json({ ok: true });
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`API running on port ${PORT}`);
});
