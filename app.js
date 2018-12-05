let app=require('express')();
let server=require('http').createServer(app);
let io=require('socket.io').listen(server);
let ent=require('ent');


let taskArray=[]    


io.sockets.on('connection',(sockets)=>{

    if (typeof(sockets.taskArray) == "undefined") {
        sockets.taskArray= [];
    }
    
    // Pseudo
    sockets.on('pseudo',(pseudo)=>{
    pseudo= ent.encode(pseudo);
    sockets.pseudo= pseudo
    sockets.broadcast.emit('pseudo_return', pseudo);
    })
    
    // task
    sockets.on('task',(task)=>{
        task= ent.encode(task);
        taskArray.push(task);
        let taskIndex= taskArray.indexOf(task);
        sockets.emit('task_return_index', taskIndex);
        sockets.broadcast.emit('task_return_client',{task: task, index: taskIndex});
    });

    // task_delete
    sockets.on('index_delete',(index)=>{
        taskArray.splice(index,1);
        sockets.emit('ArraySlice', taskArray)
    })



})

// root
app.get('/todo',(req,res)=>{
    res.render('index.ejs',{todolist: taskArray});
})

app.use((req,res)=>{
    res.redirect('/todo')
})

server.listen(8080);