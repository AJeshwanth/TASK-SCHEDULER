const express=require("express")
const cors = require("cors");
const mongoose=require("mongoose")
require("dotenv").config()
mongoose.connect(process.env.MONGO_URI).then(() => console.log("MONGO DB CONNECTED")).catch("ERROR")
const app=express()
app.use(cors());
const authRoutes=require("./ROUTES/authRoutes")
app.use(express.json())
app.use("/api/auth", authRoutes)
const taskRoutes=require("./ROUTES/taskRoutes")
app.use("/api/tasks", taskRoutes)
app.get("/", (req, res) =>res.send("API RUNNING"))

app.listen(5000, () => {
    console.log("Server running on port 5000")
})