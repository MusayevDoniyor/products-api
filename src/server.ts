import express, {
  ErrorRequestHandler,
  Request,
  Response,
  NextFunction,
} from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import productsRoute from "./routes/products.routes.js";
import helmet from "helmet";
import morgan from "morgan";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.use(helmet());
app.use(morgan("dev"));

app.use("/api/v1/products", productsRoute);

app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({ message: "API route not found" });
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error("❌ Error:", err.message);

  res
    .status(500)
    .json({ message: "Internal Server Error", error: err.message });
});

connectDB();

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
