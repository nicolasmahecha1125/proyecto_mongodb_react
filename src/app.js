import express from 'express';
import morgan from 'morgan';
import authRoutes from './routes/auth.routes.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import tasksRoutes from './routes/tasks.routes.js';
import productsRoutes from './routes/product.routes.js'
import path from 'path';
import { fileURLToPath } from "url";
import orderRoutes from "./routes/order.routes.js";
import receiptRoutes from "./routes/receipt.routes.js";
import productEntryRoutes from "./routes/productEntry.routes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());

app.use('/api',authRoutes);
app.use('/api',tasksRoutes);
app.use('/api', productsRoutes);
app.use("/api", orderRoutes);
app.use("/api", receiptRoutes);
app.use("/api/product-entries", productEntryRoutes);
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

export default app;