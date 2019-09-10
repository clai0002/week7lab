let mongoose = require("mongoose");
let taskSchema = mongoose.Schema({
    TaskID: Number,
    Taskname:String,
    assignto :{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'developer'
    },
    Duedate:{
        type: Date
    },
    taskstatus: {
        type:String,
        validate: function(statusvalue){
            return statusvalue === 'Inprogress' || statusvalue === 'Completed'
        }
    },
    taskdescription: String
})

let taskModel = mongoose.model('task',taskSchema)
module.exports = taskModel