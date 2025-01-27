import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import path from "path";
import csv from "csvtojson";
import quiz from "./models/quiz.js";
import { connectDB } from "./db/db.js";

dotenv.config();
const app = express();

app.set("view engine", "ejs");



app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let totalCorrect = 0;
let quizi = [];
let currentQuestion = null;

async function importCSVData() {
  const quizCount = await quiz.countDocuments();
  if (quizCount === 0) {
    const csvFilePath = path.join(__dirname, "capitals.csv");
    csv()
      .fromFile(csvFilePath)
      .then((jsonObj) => {
        console.log("Converted JSON data from CSV:", jsonObj);
        quiz.insertMany(jsonObj)
          .then(() => {
            console.log("CSV data imported successfully.");
          })
          .catch((err) => {
            console.error("Error importing data:", err);
          });
      });
  } else {
    console.log("Data already exists in the database.");
  }
}

async function loadQuizData() {
  try {
    quizi = await quiz.find(); // Fetch all quiz data
  } catch (err) {
    console.error("Error fetching quiz data:", err);
  }
}

async function nextQuestion() {
  currentQuestion = quizi[Math.floor(Math.random() * quizi.length)];
}

app.get("/", async (req, res) => {
  await loadQuizData();
  await nextQuestion();
  res.render("quizes.ejs", {
    question: currentQuestion,
    totalScore: totalCorrect,
    wasCorrect: null,
  });
});

app.post("/submit", async (req, res) => {
  const answer = req.body.answer.trim();
  let isCorrect = false;

  if (
    currentQuestion &&
    currentQuestion.capital.toLowerCase() === answer.toLowerCase()
  ) {
    totalCorrect++;
    isCorrect = true;
  } else {
    totalCorrect = 0; // Reset score on incorrect answer
  }

  await nextQuestion();
  res.render("quizes.ejs", {
    question: currentQuestion,
    totalScore: totalCorrect,
    wasCorrect: isCorrect,
  });
});

app.listen(process.env.PORT || 3000, '0.0.0.0', () => {
  console.log('Server is up and running');
  connectDB();
  importCSVData();
});





// Ṭrials of code previously was in postgres convereted to mongodb

// import express from "express";
// import mongoose from "mongoose";
// import bodyParser from "body-parser";
// import csv from 'csvtojson';
// import quiz from './models/quiz.js'
// // import pg from "pg";

// const app=express();
// const port=3000;
// // // database info
// // const db=new pg.Client({
    
// // });

// // db.connect();
// // // country list
// // // let quiz=[
// // //     {country:"INDIA",capital:"NEW DELHI"}
// // // ];
// let quizi=[];
// // db.query("SELECT*FROM capitals",(err,res)=>{
// //     if (err) {
// //         console.log("Error has occured",err.stack);
// //     }
// //     else{
// //         quiz=res.rows;
// //     }
// //     db.end();
// // });
// // variable init 
// let totalCorrect=0;
// // /middlewares
// app.use(bodyParser.urlencoded({extended:true}));
// app.use(express.static("public"));


// csv()
//   .fromFile("capitals.csv") // Provide the path to your CSV file
//   .then((jsonObj) => {
//     quiz.insertMany(jsonObj)
//       .then(() => {
//         console.log("CSV data imported successfully");
//         mongoose.connection.close();
//       })
//       .catch((err) => {
//         console.error("Error importing data:", err);
//       });
//   });
// mongoose.connect("mongodb://localhost:27017/quizdb", {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
//   })
//   .then(() => {
//     console.log("Connected to MongoDB");
//   })
//   .catch((err) => {
//     console.error("Error connecting to MongoDB:", err);
//   });
  
// //   let totalCorrect = 0;

// // // Variable to store the current question
// // let currentques = {};
// //   // Middlewares
// //   app.use(bodyParser.urlencoded({ extended: true }));
// //   app.use(express.static("public"));

// //   app.get("/", async (req, res) => {
// //     totalCorrect = 0;
// //     await nextQuestion();
// //     res.render("quizes.ejs", { question: currentques, totalScore: totalCorrect });
// //   });
  
// //   // Handle form submission
// //   app.post("/submit", async (req, res) => {
// //     let answer = req.body.answer.trim();
// //     let isCorrect = false;
  
// //     // Ensure currentques.capital is defined before comparing
// //     if (currentques && currentques.capital) {
// //       if (currentques.capital.toLowerCase() === answer.toLowerCase()) {
// //         totalCorrect++;
// //         isCorrect = true;
// //       }
// //     } else {
// //       console.log("Error: currentques.capital is undefined");
// //     }
  
// //     await nextQuestion();
// //     res.render("quiz.ejs", {
// //       question: currentques,
// //       wasCorrect: isCorrect,
// //       totalScore: totalCorrect,
// //     });
// //   });
  
// //   // Function to fetch a random country and set the question
// //   async function nextQuestion() {
// //     try {
// //       const quizCount = await Quiz.countDocuments(); // Get count of documents in Quiz collection
// //       const randomIndex = Math.floor(Math.random() * quizCount); // Generate a random index
// //       currentques = await Quiz.findOne().skip(randomIndex); // Fetch a random country and capital
  
// //       if (!currentques) {
// //         console.log("No question found");
// //       }
// //     } catch (err) {
// //       console.log("Error fetching question: ", err);
// //     }
// //   }
// await nextquestion();
// let currentques={};
// app.get("/",async(req,res)=>{
//     // totalCorrect=0;
//     // await nextquestion();
//     // console.log(currentques)
//     // res.render("quiz.ejs",{question:currentques});
//     try {
//         quizi = await quiz.find(); // This fetches all records from the "Quiz" collection
//         console.log(quiz); // Log the quiz data
    
//         // Render the quiz page (you can pass quiz data to your template)
//         res.render('quizes.ejs', { question: quiz[0] }); // Render first question for example

//       } catch (err) {
//         console.error('Error fetching quiz data:', err);
//         res.status(500).send('Error fetching quiz data');
//       }
// });
// app.post("/submit",(req,res)=>{
//     let answer=req.body.answer.trim();
//     let isCorrect=false;
//     if(currentques.capital.toLowerCase()===answer.toLowerCase()){
//         totalCorrect++;
//         console.log(totalCorrect);
//         isCorrect=true;
//     }
//     nextquestion();
//     res.render("quizes.ejs",{
//         question:currentques,
//         wasCorrect:isCorrect,
//         totalScore:totalCorrect,
//     });
// });
// async function nextquestion(){
//     const random_country=quizi[Math.floor(Math.random()*quiz.length)];
//     currentques=random_country;
// }
// app.listen(port,()=>{
//     console.log(`Server is running on port ${port}`);
// });

