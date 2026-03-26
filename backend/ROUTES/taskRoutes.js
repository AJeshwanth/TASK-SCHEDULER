const express=require("express")
const router=express.Router()
const {createTask, getTask, updateTask, deleteTask, getAnalytics}=require("../CONTROLLERS/taskController")
const {auth}=require("../MIDDLEWARE/authMiddle")
router.post("/", auth, createTask)
router.get("/", auth, getTask)
router.put("/:id", auth, updateTask)
router.delete("/:id", auth, deleteTask)
router.get("/analytics", auth, getAnalytics);
module.exports=router;