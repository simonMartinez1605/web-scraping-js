const express = require('express'); 
require('dotenv').config(); 
const app = express(); 

app.get("/check-price", (req, res) =>{
    res.send("hola")
})

let port = process.env.PORT; 

app.listen(port, console.log(`listening in port ${port}`)); 