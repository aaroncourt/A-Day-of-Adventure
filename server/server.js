require("dotenv").config();
const express = require('express');
const cookieParser = require('cookie-parser')
const app = express();
const cors = require('cors');


app.use(cors({credentials: true, origin: 'http://localhost:3000'}));
app.use(cookieParser())
app.use(express.json());
app.use(express.urlencoded({ extended: true })); 

require('./config/mongoose.config');    
require('./routes/user.routes')(app);
require('./routes/post.routes')(app);
require('./routes/comment.routes')(app);
require('./routes/like.routes')(app);
require('./routes/picture.routes')(app);



app.listen(process.env.MY_PORT, () => console.log(`Listening on port:${process.env.MY_PORT} `) );