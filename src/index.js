import express from'express'; 
import './connection.js' 
import dotenv from 'dotenv'
import { ProductsPriceChecker } from './product_price_checker.js';
dotenv.config(); 
const app = express(); 

app.get("/check-price", async (req, res) =>{
    const productsPriceChecker = new ProductsPriceChecker()
    await productsPriceChecker.check()
    res.send("Precios comparados ")
}); 

const port = process.env.PORT; 

app.listen(port, console.log(`listening in port ${port}`)); 