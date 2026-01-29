import express from "express";
import cors from "cors";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Needed for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve frontend
app.use(express.static(path.join(__dirname, "../public")));

// Signature endpoint
app.get("/signature", (req, res) => {
  const { meetingNumber, role } = req.query;

  const payload = {
    sdkKey: process.env.ZOOM_MEETING_SDK_KEY,
    mn: meetingNumber,
    role: Number(role),
    iat: Math.floor(Date.now() / 1000) - 30,
    exp: Math.floor(Date.now() / 1000) + 60 * 60,
    appKey: process.env.ZOOM_MEETING_SDK_KEY,
    tokenExp: Math.floor(Date.now() / 1000) + 60 * 60,
  };

  const signature = jwt.sign(
    payload,
    process.env.ZOOM_MEETING_SDK_SECRET,
    { algorithm: "HS256" }
  );

  res.json({ signature });
});

// Force index.html
app.get("*", (_, res) => {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});

app.listen(4000, () => {
  console.log("Server running at http://localhost:4000");
});
