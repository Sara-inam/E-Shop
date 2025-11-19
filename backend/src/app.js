import express from "express";
import authRouter from './routes/auth.route.js'; 

const app = express();

app.use(express.json());


app.use("/auth", authRouter);      
      


app.use((req, res) => {
  res.status(404).json({ message: "API endpoint not found" });
});

export default app;
