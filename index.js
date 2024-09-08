import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app=express();
const port=3000;
// database info
const db=new pg.Client({
    user:"postgres",
    host:"localhost",
    database:"hello_world",
    password:"harshith@1204",
    port:5432,
});

db.connect();
// country list
// let quiz=[
//     {country:"INDIA",capital:"NEW DELHI"}
// ];
let quiz=[];
db.query("SELECT*FROM capitals",(err,res)=>{
    if (err) {
        console.log("Error has occured",err.stack);
    }
    else{
        quiz=res.rows;
    }
    db.end();
});
// variable init 
let totalCorrect=0;
// /middlewares
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

let currentques={};
app.get("/",async(req,res)=>{
    totalCorrect=0;
    await nextquestion();
    console.log(currentques)
    res.render("quiz.ejs",{question:currentques});
});
app.post("/submit",(req,res)=>{
    let answer=req.body.answer.trim();
    let isCorrect=false;
    if(currentques.capital.toLowerCase()===answer.toLowerCase()){
        totalCorrect++;
        console.log(totalCorrect);
        isCorrect=true;
    }
    nextquestion();
    res.render("quiz.ejs",{
        question:currentques,
        wasCorrect:isCorrect,
        totalScore:totalCorrect,
    });
});
async function nextquestion(){
    const random_country=quiz[Math.floor(Math.random()*quiz.length)];
    currentques=random_country;
}

app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
});