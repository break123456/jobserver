const express = require('express');
const dotenv = require('dotenv');
const connection = require('./databases/db')
const passport = require('passport');
const userRouter = require('./routes/user-route');
const bodyParser = require('body-parser')
const cors = require('cors')

dotenv.config();

const app = express();
const PORT = process.env.PORT;
app.use(bodyParser.json({extended: true}));
app.use(bodyParser.urlencoded({extended: true}));
app.use(cors());
app.use(passport.initialize())
app.use(passport.initialize())
require('./configs/passport-config').passportStrategy(passport)

const URL = 'mongodb+srv://intern:intern321@cluster0.shjue.mongodb.net/internship?retryWrites=true&w=majority';

connection(URL);

app.get('/', function(req, res) {
    res.send("Hello world");
});

app.use('/api/user', userRouter)

app.listen(PORT, () => {
    console.log(`jobserver started at port ${PORT}`);
});