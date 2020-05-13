const express = require('express');
const path = require('path');
const Game = require('./routes/game.js');
const app = express();

app.listen(3000, ()=>{
    console.log("server is listening at localhost:3000");
});
app.use(express.static(
    path.join(__dirname, 'public'),
));

Game(app);