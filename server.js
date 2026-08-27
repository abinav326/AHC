const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3000;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "change-this-password";

const ROOT = __dirname;
const PUBLIC = path.join(ROOT, "public");
const UPLOADS = path.join(ROOT, "uploads");
const DATA_FILE = path.join(ROOT, "data.json");

fs.mkdirSync(UPLOADS, { recursive: true });

const defaultData = {
  equipment: [],
  activities: []
};

function loadData() {
  try {
    if (!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, JSON.stringify(defaultData, null, 2));
    return JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
  } catch {
    return { ...defaultData };
  }
}
function saveData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(UPLOADS));
app.use(express.static(PUBLIC));

const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, UPLOADS),
  filename: (_, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const safe = path.basename(file.originalname, ext)
      .replace(/[^a-z0-9]+/gi, "-")
      .replace(/^-|-$/g, "")
      .toLowerCase();
    cb(null, `${Date.now()}-${safe || "photo"}${ext}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 8 * 1024 * 1024 },
  fileFilter: (_, file, cb) => {
    const allowed = /jpeg|jpg|png|webp|gif/i.test(path.extname(file.originalname));
    cb(allowed ? null : new Error("Only JPG, PNG, WEBP and GIF images are allowed."), allowed);
  }
});

function auth(req, res, next) {
  const password = req.headers["x-admin-password"];
  if (password !== ADMIN_PASSWORD) return res.status(401).json({ error: "Invalid admin password." });
  next();
}

app.get("/api/content", (_, res) => res.json(loadData()));

app.post("/api/equipment", auth, upload.array("photos", 12), (req, res) => {
  const data = loadData();
  const item = {
    id: Date.now().toString(),
    name: req.body.name?.trim(),
    description: req.body.description?.trim() || "",
    photos: (req.files || []).map(f => `/uploads/${f.filename}`),
    createdAt: new Date().toISOString()
  };
  if (!item.name) return res.status(400).json({ error: "Equipment name is required." });
  data.equipment.unshift(item);
  saveData(data);
  res.json(item);
});

app.post("/api/activities", auth, upload.array("photos", 20), (req, res) => {
  const data = loadData();
  const item = {
    id: Date.now().toString(),
    title: req.body.title?.trim(),
    date: req.body.date || "",
    description: req.body.description?.trim() || "",
    photos: (req.files || []).map(f => `/uploads/${f.filename}`),
    createdAt: new Date().toISOString()
  };
  if (!item.title) return res.status(400).json({ error: "Activity title is required." });
  data.activities.unshift(item);
  saveData(data);
  res.json(item);
});

app.delete("/api/equipment/:id", auth, (req, res) => {
  const data = loadData();
  const item = data.equipment.find(x => x.id === req.params.id);
  if (!item) return res.status(404).json({ error: "Equipment not found." });
  item.photos.forEach(removeUpload);
  data.equipment = data.equipment.filter(x => x.id !== req.params.id);
  saveData(data);
  res.json({ ok: true });
});

app.delete("/api/activities/:id", auth, (req, res) => {
  const data = loadData();
  const item = data.activities.find(x => x.id === req.params.id);
  if (!item) return res.status(404).json({ error: "Activity not found." });
  item.photos.forEach(removeUpload);
  data.activities = data.activities.filter(x => x.id !== req.params.id);
  saveData(data);
  res.json({ ok: true });
});

function removeUpload(url) {
  if (!url?.startsWith("/uploads/")) return;
  const file = path.join(UPLOADS, path.basename(url));
  if (fs.existsSync(file)) fs.unlinkSync(file);
}

app.use((err, req, res, next) => {
  if (err) return res.status(400).json({ error: err.message || "Upload failed." });
  next();
});

app.listen(PORT, () => {
  console.log(`Anaswara Health Club running at http://localhost:${PORT}`);
});