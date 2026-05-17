import express from "express";
import connectionRoutes from "./routes/connectionRoutes";

const app = express();
app.use(express.json());

app.use("/api/connections", connectionRoutes);

export default app;
