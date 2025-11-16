import express from "express";
import cors from "cors";
import Database from "better-sqlite3";
import path from "node:path";
import fs from "node:fs";

const PORT = process.env.PORT || 4000;
const DB_PATH = path.join(process.cwd(), "content.db");

if (!fs.existsSync(DB_PATH)) {
  fs.closeSync(fs.openSync(DB_PATH, "w"));
}

const db = new Database(DB_PATH);

db.prepare(
  `CREATE TABLE IF NOT EXISTS content (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    payload TEXT NOT NULL
  )`
).run();

const app = express();
app.use(cors());
app.use(express.json({ limit: "1mb" }));

function getContentFromDB() {
  const row = db.prepare("SELECT payload FROM content WHERE id = 1").get();
  return row ? JSON.parse(row.payload) : null;
}

function saveContentToDB(payload) {
  const data = JSON.stringify(payload);
  const existing = db.prepare("SELECT id FROM content WHERE id = 1").get();
  if (existing) {
    db.prepare("UPDATE content SET payload = ? WHERE id = 1").run(data);
  } else {
    db.prepare("INSERT INTO content (id, payload) VALUES (1, ?)").run(data);
  }
}

app.get("/api/content", (req, res) => {
  const content = getContentFromDB();
  if (!content) {
    return res.status(204).send();
  }
  res.json(content);
});

app.put("/api/content", (req, res) => {
  const payload = req.body;
  if (!payload || typeof payload !== "object") {
    return res.status(400).json({ message: "Payload must be JSON object" });
  }
  saveContentToDB(payload);
  res.status(204).send();
});

app.listen(PORT, () => {
  console.log(`Sync server listening on http://localhost:${PORT}`);
});
