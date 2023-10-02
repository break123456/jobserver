const express = require('express');
const dotenv = require('dotenv');
const connection = require('./databases/db')
const passport = require('passport');
const bodyParser = require('body-parser')
const cors = require('cors');
const studentRouter = require('./routes/student');
const userRouter = require('./routes/user');
const employerRouter = require('./routes/employer');

dotenv.config({path : "../.env"});

const app = express();
const PORT = process.env.PORT;
app.use(bodyParser.json({extended: true}));
app.use(bodyParser.urlencoded({extended: true}));
app.use(
    cors({
      origin: "*",
      methods: "GET,POST,PUT,DELETE,PATCH",
      credentials: true,
    })
  );
app.use(passport.initialize())
app.use(passport.initialize())
require('./configs/passport-config').passportStrategy(passport)

// const URL = 'mongodb+srv://intern:intern321@cluster0.shjue.mongodb.net/internship?retryWrites=true&w=majority';

connection(process.env.MONGODB_URL);

app.get('/', function(req, res) {
    res.send("Hello world");
});

app.use('/api/user', userRouter);
app.use('/api/student', studentRouter);
app.use('/api/employer', employerRouter);

app.listen(process.env.PORT, () => {
    console.log(`jobserver started at port ${PORT}`);
});