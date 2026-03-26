const mongoose=require("mongoose")
const taskschema=new mongoose.Schema({
    title:{
        type:String,
        required: true
    },
    description:{
        type:String
    },
    taskStatus:{
        type:String,
        enum :["Todo", "In Progress", "Done"],
        default: "Todo"
    },
    priority:{
        type:String,
        enum:["Low", "Medium", "High"],
        default :"LOW"
    },
    dueDate:{
        type:Date,
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
        required:true
    }
}, {timestamps :true})
module.exports=mongoose.model("task", taskschema)