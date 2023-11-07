import express from "express";
import OpenAI from "openai";
import { config } from "dotenv";
import cors from "cors";
import fs from "fs";
import multer from "multer";
config();

const app = express();
app.use(express.json());
app.use(cors());
const PORT = 3080;

const openai = new OpenAI({
  apiKey: process.env.API_KEY, // This is also the default, can be omitted
});

// Where to save images:
const storage = multer.diskStorage({
  // which folder:(root)
  destination: (req, res, cb) => {
    const uploadDir = "./uploads"; // Define the directory where uploaded files will be stored
    fs.mkdirSync(uploadDir, { recursive: true }); // Create the directory if it doesn't exist
    cb(null, "uploads");
  },
  // fileNames:
  filename: (req, file, cb) => {
    console.log("file", file);
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage }).single("file");
let filePath;

// Send the text and get the images:
app.post("/ImageGenerate", async (req, res) => {
  try {
    const image = await openai.images.generate({
      prompt: req.body.prompt,
      n: req.body.n,
      size: "1024x1024",
    });
    console.log(image.data);
    res.send(image.data);
  } catch (err) {
    console.log(err);
  }
});

// upload images to backend to edit:
app.post("/Upload", async (req, res) => {
  upload(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      res.status(500).json(err);
    } else if (err) {
      res.status(500).json(err);
    } else {
      // The file was uploaded successfully
      res.status(200).json({ message: "File uploaded successfully" });
    }
    console.log(req.file.path);
    filePath = req.file.path;
  });
});

app.post("/variations", async (req, res) => {
  try {
    console.log("Number:",req.body.n)
    const image = await openai.images.createVariation({
      image: fs.createReadStream(filePath),
      n:req.body.n
    });

    console.log(image.data);
    res.send(image.data);
  } catch (error) {
    console.log(error);
  }
});

app.listen(PORT, () => {
  console.log("App is working on this ", PORT);
});
