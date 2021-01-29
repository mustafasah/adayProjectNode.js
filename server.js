const express = require("express")
const dotenv = require("dotenv")
const connectDatabase = require("./helpers/connectDatabase")
const routers = require("./routers/index")
const path = require("path")
const customErrorHandling = require ("./middlewares/customErrorHandling")
const cookieParser = require("cookie-parser")
const cors = require("cors")

dotenv.config({
    path: "./config/config.env"
})

connectDatabase()

const app = express()
app.use(cookieParser())
app.use(express.static(path.join(__dirname,"/Front-End")))

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname+ '/Front-End'))
})

app.get('/api/auth/resetpassword', function (req, res) {
    res.sendFile(path.join(__dirname+ '/Front-End/index.html'))
})

// app.get('/adaylar', function (req, res) {
//     res.sendFile(path.join(__dirname+ '/Front-End/adaylar.html'))
// })

// app.get('/kullanicilar', function (req, res) {
//     res.sendFile(path.join(__dirname+ '/Front-End/kullanicilar.html'))
// })




app.use(function(req, res, next) {  
    res.header('Access-Control-Allow-Origin', req.headers.origin);
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Headers","*");
    res.header("Access-Control-Allow-Headers","http://localhost");
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    next();
});  

app.use(cors())

app.use(express.json())

const PORT = process.env.PORT

app.use("/api",routers)

app.use(customErrorHandling)

app.listen(PORT,() => {
    console.log(`App Started on : ${PORT} : ${process.env.NODE_ENV}`)
})


module.exports = app