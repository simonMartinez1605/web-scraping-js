import express from'express'; 
import './connection.js' 
const app = express(); 

app.get("/check-price", (req, res) =>{
    res.send("hola")
}); 

const port = 4000; 

app.listen(port, console.log(`listening in port ${port}`)); 