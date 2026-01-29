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

// Zoom Requirement for better performance (SharedArrayBuffer)
app.use((req, res, next) => {
  res.header("Cross-Origin-Opener-Policy", "same-origin");
  res.header("Cross-Origin-Embedder-Policy", "require-corp");
  next();
});


// Needed for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve frontend
app.use(express.static(path.join(__dirname, "../public")));

// Serve Zoom SDK locally
app.use("/sdk", express.static(path.join(__dirname, "node_modules/@zoom/meetingsdk/dist")));

// Signature endpoint
app.get("/signature", (req, res) => {
  const { meetingNumber, role } = req.query;

  const sdkKey = process.env.ZOOM_MEETING_SDK_KEY;      // Client ID
  const sdkSecret = process.env.ZOOM_MEETING_SDK_SECRET; // Client Secret

  const iat = Math.floor(Date.now() / 1000) - 30;
  const exp = iat + 60 * 60;

  const payload = {
    sdkKey: sdkKey,
    appKey: sdkKey,
    mn: meetingNumber,
    role: Number(role),
    iat,
    exp,
    tokenExp: exp,
  };

  const signature = jwt.sign(payload, sdkSecret, { algorithm: "HS256" });

  res.json({ signature, sdkKey });
});


// Force index.html
app.get("*", (_, res) => {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});

app.listen(4000, () => {
  console.log("Server running at http://localhost:4000");
});
