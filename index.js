import express from "express";
import mongoose from "mongoose";
import Student from "./studentModel.js";
import cors from "cors";
import bodyParser from "body-parser";

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// MongoDB Connection
const mongoUrl = "mongodb+srv://piyumal:piyumalM@cluster0.awsjm.mongodb.net/?retryWrites=true&w=majority";
mongoose
  .connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// API Endpoints
app.post("/students", async (req, res) => {
  try {
    const student = new Student(req.body);
    const savedStudent = await student.save();
    res.status(201).json(savedStudent);
  } catch (error) {
    res.status(500).send({ error: "Failed to add student" });
  }
});

app.put("/students/:id", async (req, res) => {
  try {
    const updatedStudent = await Student.findOneAndUpdate(
      { reg: req.params.id },
      req.body,
      { new: true }
    );
    res.status(200).json(updatedStudent);
  } catch (error) {
    res.status(500).send({ error: "Failed to update student" });
  }
});

app.delete("/students/:id", async (req, res) => {
  try {
    await Student.findOneAndDelete({ reg: req.params.id });
    res.status(200).send("Student deleted successfully");
  } catch (error) {
    res.status(500).send({ error: "Failed to delete student" });
  }
});

app.get("/students", async (req, res) => {
  try {
    const students = await Student.find();
    res.status(200).json(students);
  } catch (error) {
    res.status(500).send({ error: "Failed to fetch students" });
  }
});

// Start Server
app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
