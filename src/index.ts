import cors from "cors";
import express, { NextFunction, Request, Response } from "express";
import downloaderRoutes from "./downloader";

require("dotenv").config();

const app = express();
const PORT = 3000;

app.use(express.json());
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.message);
  res.status(500).json({ error: "Internal Server Error" });
});

app.use(
  cors({
    origin: "http://localhost:5500", // Replace with your frontend's URL and port
    methods: ["GET", "POST"], // Specify the allowed HTTP methods
    allowedHeaders: ["Content-Type"], // Specify allowed headers
  })
);

app.use("/api/download", downloaderRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
