import express, { NextFunction, Request, Response } from "express";
import downloaderRoutes from "./downloader";

const app = express();
const PORT = 5000;

// Middleware for parsing JSON
app.use(express.json());

// Register routes
app.use("/api/download", downloaderRoutes);

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.message);
  res.status(500).json({ error: "Internal Server Error" });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
