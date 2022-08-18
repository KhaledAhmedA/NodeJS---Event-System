require("dotenv").config();
const express = require("express");
const app = express();
const body_parser = require("body-parser");
const cors = require('cors');
const morgan = require('morgan');
const multer = require("multer");
const path = require("path");

//image vars
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // console.log(path.join(__dirname, "images"));
        cb(null, path.join(__dirname, "images"))
    },
    filename: (req, file, cb) => {
        cb(null, new Date().toLocaleDateString().replace(/\//g, "-") + "-" + file.originalname)
    }
})

const fileFilter = (req, file, cb) => {
    if (file.mimetype == "image/jpeg" ||
        file.mimetype == "image/jpg" ||
        file.mimetype == "image/png"
    )
        cb(null, true)
    else
        cb(null, false)

}
const mongoose = require("mongoose");

const authenticationRouter = require("./routers/authenticationRouter");
const speakerRouter = require("./routers/speakerRouter");
const studentRouter = require("./routers/studentRouter");
const eventRouter = require("./routers/eventRouter");


mongoose.connect(process.env.DB_URL)
    .then(() => {
        console.log("database connected");

        app.listen(process.env.PORT_NUMBER , () => {
            console.log("I am Listenining .......")
        });

    })

    .catch(error => {
        console.log("DB Problem");
    });
// listen on port Number
// app.listen(process.env.PORT||8080,()=>{
//     console.log("I am Listenining .......")
// });

//Middlewares
// app.use(morgan(":method :url"));
app.use(morgan("tiny"));

//CORS
app.use(cors());
// app.use((request,response,next)=>{
//     response.header("Access-Control-Allow-Origin","*");
//     response.header("Access-Control-Allow-Methods","GET,POST,DELETE,PUT,OPTIONS");
//     response.header("Access-Control-Allow-Headers","Content-Type,Authorization")
//     next();
// })

app.use("/images",express.static(path.join(__dirname, "images")))
app.use(multer({storage, fileFilter}).single("image"));
app.use(body_parser.json());
app.use(body_parser.urlencoded({ extended: false }));
//////////////////////////////////// Routers
app.use(authenticationRouter);
app.use(speakerRouter);
app.use(studentRouter);
app.use(eventRouter);

// app.get('/home',function(req,res)
// {
// res.send('HOME');
// });




//Not found MW
app.use((request, response) => {
    response.status(404).json({ data: "Not Found" });
})

//Error MW
app.use((error, request, response, next) => {   //JS  code function.length
    let status = error.status || 500;
    response.status(status).json({ Error: error + "" });
})




