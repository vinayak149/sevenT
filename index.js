const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
const port = 8000;
const expressLayouts = require('express-ejs-layouts');
const db = require('./config/mongoose');
const mongoose = require('mongoose');

app.use(express.urlencoded());

app.use(cookieParser());

//database
const database = (module.exports = () => {
    const connectionParams = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    };
    try {
        mongoose.connect(
            "mongodb+srv://vinayaksharma7149:vinayak@cluster0.sbbxrjd.mongodb.net/",
            connectionParams
        );
        console.log("Database connected succesfully");
    } catch (error) {
        console.log(error);
        console.log("Database connection failed");
    }
});

database();


app.use(express.static('./assets'));

app.use(expressLayouts);
// extract style and scripts from sub pages into the layout
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);


// use express router
app.use('/', require('./routes'));

// set up the view engine
app.set('view engine', 'ejs');
app.set('views', './views');


app.listen(port, function (err) {
    if (err) {
        console.log(`Error in running the server: ${err}`);
    }

    console.log(`Server is running on port: ${port}`);
});
