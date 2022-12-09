const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const mysql =require("mysql")


const db = mysql.createPool(
    {
        host:"localhost",
        user:"root",
        password:"",
        database:"todo"
    }
)
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({extended:true}));


app.get("/api/get",(req,res)=>
{
    const sqlGet = "SELECT * FROM todos  ";
    db.query(sqlGet,(error,result)=>
    {
        res.send(result);
    })
})

app.post("/api/post",(req,res)=>
{
    const {todo,check} = req.body;
    const checked = check ? 1:0;
    const sqlInsert="INSERT INTO todos (todo,checked) VALUES (?,?)"
    db.query(sqlInsert,[todo,checked],(error,result)=>
    {
        if(error){
            console.log(error);
        }else{
            res.send(result)
        }
        
    })
})
app.delete("/api/remove/:id",(req,res)=>
{
    const {id} = req.params;
    const sqlRemove="DELETE FROM todos WHERE id = ?"
    db.query(sqlRemove,id,(error,result)=>
    {
        if(error){
            console.log(error);
        }else{
            res.send(result)
        }
        
    })
})

app.get("/api/get/:id",(req,res)=>
{
    const {id} = req.params;
    const sqlGet = "SELECT * FROM todos WHERE id=? ";
    
    db.query(sqlGet,[id],(error,result)=>
    {
        if(error)
        {
            console.log(error);
        }
        res.send(result);
    })
})
app.put("/api/update/:id",(req,res)=>
{
    const {id} = req.params;
    const {todo,check} = req.body;
    const checked = check ? 1:0;
    const sqlUpdate = "UPDATE todos SET todo=? ,checked=? where id=?";
    db.query(sqlUpdate,[todo,checked,id],(error,result)=>
    {
        if(error)
        {
            console.log(error);
        }
        res.send(result);
    })
})
app.put("/api/complete/:id/:iscompleted",(req,res)=>
{
    const {id,iscompleted} = req.params;
 
    const sqlUpdate = `UPDATE todos SET iscompleted=${iscompleted} where id=${id}`;
    db.query(sqlUpdate,[id,iscompleted],(error,result)=>
    {
        if(error)
        {
            console.log(error);
        }
        res.send(result);
    })
})

app.get("/",(req,res)=>
{
    // const sqlInsert="INSERT INTO todos (todo) VALUES ('study all day')";
    // db.query(sqlInsert,(err,result)=>
    // {
    //     console.log("error",err);
    //     console.log("result",result); 
    //     res.send("hello express")
    // })
    
})


app.listen(5000,()=>
{
    console.log("server is running on port 5000");
})