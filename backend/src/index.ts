import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import dotenv from "dotenv";

import { auth, UnauthorizedError } from "express-oauth2-jwt-bearer";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Configure JWT validation middleware
const checkJwt = auth({
  issuerBaseURL: `https://${process.env.AUTH0_DOMAIN}`,
  audience: process.env.AUTH0_AUDIENCE,
});

app.get("/public", (req: Request, res: Response) => {
  res.json({ message: "Public endpoint - no authentication required" });
});

app.get("/private", checkJwt, (req: Request, res: Response) => {
  res.json({
    message: "Private endpoint",
    user: req.auth?.payload.sub,
  });
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof UnauthorizedError) {
    res
      .status(err.status)
      .set(err.headers)
      .json({
        error: err.statusCode || "unauthorized",
        message: "Authentication required",
      });
  } else {
    res.status(500).json({
      error: "server_error",
      message: "Internal Server Error",
    });
  }
});

app.listen(3001, () => {
  console.log(`🚀 Server running on port 3001`);
});
