let express = require('express');
let app = express();

let bodyParser = require('body-parser');
let mongoose = require('mongoose')

let task = require('./models/task')
let developer = require('./models/developer')

const url = 'mongodb://localhost:27017/Task'
let viewsPath= __dirname+"/html"

app.use(bodyParser.urlencoded({
    extended: false
}));
app.engine("html",require('ejs').renderFile);
app.set("view engine",'html')
app.use(express.static('css'));
app.use(express.static('images'))

mongoose.connect(url,{useNewUrlParser:true},(err,client)=>{
    if(err){
        throw err;
    }
    else{
        console.log("succesfully connected");
    }
});


app.get("/",function(req,res){
    let fileName = viewsPath + "/home.html"
    res.sendFile(fileName);
});

app.get("/insertnewtask",function(req,res){
    let fileName = viewsPath + "/insertnewtask.html"
    res.sendFile(fileName);
});


app.post("/addmytask",function(req,res){
    let taskDetails = req.body;
    taskDetails.taskID = getNewId()
    task.create({
        TaskID: taskDetails.taskID,
        Taskname:taskDetails.taskname,
        assignto:taskDetails.assign,
        Duedate:taskDetails.taskduedate,
        taskstatus:taskDetails.status,
        taskdescription:taskDetails.description
    })
    res.redirect("/getalltask");

})

app.get('/getalltask', function (req, res) {
    let fileName =  viewsPath + "/getalltask.html" 
    task.find().exec(function (err, result) {
        if (err) {
            res.redirect('/404');
        } else {
            res.render(fileName, { task : result })
        }
    }) 

})


app.get("/adddeveloper",function(req,res){
    let fileName = viewsPath + "/adddeveloper.html"
    res.sendFile(fileName);
});

app.post("/adddev",function(req,res){
    let devDetails = req.body;
    developer.create({
        name:{
            firstname: devDetails.firstname,
            lastname:devDetails.lastname
        },
        level:devDetails.level,
        address:{
            state:devDetails.state,
            suburb:devDetails.suburb,
            street:devDetails.street,
            Unit:devDetails.unit
        }

    })
    res.redirect("/getalldeveloper");
});

app.get('/getalldeveloper', function (req, res) {
    let fileName =  viewsPath + "/getalldeveloper.html"
    developer.find().exec(function (err, result) {
        if (err) {
            res.redirect('/404');
        } else {
            res.render(fileName, { dev : result })
        }
    }) 


})





app.get('/deletetask',function(req,res){
    let fileName = viewsPath + "/deletetask.html"
    res.sendFile(fileName);
})

app.post('/deletemytask',function(req,res){
    let taskDetails = req.body
    let ID = parseInt(taskDetails.taskID)
    console.log(ID)
    task.deleteOne({TaskID : ID},function(err,doc){
        console.log(doc)
    })
    res.redirect('/getalltask')
})

app.get('/deleteCompleted',function(req,res){
    task.deleteMany({taskstatus : 'Completed'},function(err,doc){
        console.log(doc)
    });
    res.redirect('/getalltask');
})

app.get('/updateTask',function(req,res){
    let fileName = viewsPath + "/updateTask.html"
    res.sendFile(fileName);
})

app.post('/updatemytask',function(req,res){
    let taskDetails= req.body
    task.updateOne({TaskID: parseInt(taskDetails.taskID)},{$set:{taskstatus : taskDetails.status}},{ upsert: true }, function (err, result) {
    });
    res.redirect('/getalltask')
})

app.listen(8080)
function getNewId() {
    return (Math.floor(100000 + Math.random() * 900000));
}

//extra task
app.get('/updatename/:oldfirstname/:newfirstname',function(req,res){
    oldname = req.params.oldfirstname;
    newname = req.params.newfirstname; 
    developer.updateMany({'name.firstname': oldname},{$set:{'name.firstname': newname}},{upsert: true},function(err,result){
    });
    res.redirect('/getalldeveloper');
})
