let mongoose = require("mongoose");
let developerSchema = mongoose.Schema({
    name:{
        firstname:{
            type:String,
            require: true
        },
        lastname: String
    },
    level:{
        type: String,
        require: true,
        validate: function(levelvalue){
            return levelvalue === "BEGINNER" || levelvalue === "EXPERT" 
        },
        message: " level must either be beginner or level"
    },
    address:{
        state: String,
        suburb: String,
        street: String,
        unit: String
    }      
})

let developermodel = mongoose.model("developer",developerSchema)
module.exports = developermodel;