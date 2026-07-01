import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import orderRoutes from "./routes/order.routes.js";

const app = express();

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));

app.use("/api/orders", orderRoutes);

export default app;