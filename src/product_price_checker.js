import puppeteer from "puppeteer";
import { ProductService } from "./product_service.js"
import nodemailer from 'nodemailer'

export class ProductsPriceChecker{
    constructor(){
        this.productService = new ProductService()
    }

    async check(){
        const Productos = await this.productService.listProducts(); 

        console.log(Productos); 

        for(const product of Productos ){
            const browser = await puppeteer.launch()

            const amazon_page = await browser.newPage()
            console.log('si') 
            // Busqueda en Amazon
            await amazon_page.goto("https://amazon.com"+ product.amazon_url)

            let amazonPriceBase = await amazon_page.waitForSelector(".a-size-base")
            let amazonPriceUnderline = await amazon_page.waitForSelector(".s-underline-text")

            let value_amazon = await amazon_page.evaluate(amazonPriceBase=>amazonPriceBase.textContent, amazonPriceBase); 

            let value_amazon_underline = await amazon_page.evaluate(amazonPriceUnderline=>amazonPriceUnderline.textContent, amazonPriceUnderline); 

            const amazon_price = parseFloat(value_amazon + value_amazon_underline);

            // Busqueda en mercado libre
            const meli_page = await browser.newPage()
            await meli_page.goto(product.meli_url)
            
            let MeliPriceBase = await meli_page.waitForSelector(".andes-money-amount__fraction"); 

            let value_meli_price = await meli_page.evaluate(MeliPriceBase=> MeliPriceBase.textContent, MeliPriceBase) 

            try{
                let meliPriceCentsEl = await meli_page.waitForSelector(".andes-money-amount__fraction")
                let value_meli_price_cents = await meli_page.evaluate(meliPriceCentsEl=> meliPriceCentsEl.textContent, meliPriceCentsEl)  

                value_meli_price = value_meli_price + "." + value_meli_price_cents; 
            }
            catch(err){}

            value_meli_price = parseFloat(value_meli_price); 

            if(amazon_price != product.amazon_price){
                await this.notify(`El precio del producto ${product.name} en Amazon a cambiado`)
                await this.productService.updateProduct(product.id, {amazon_price: amazon_price})
            }

            if(value_meli_price != product.meli_price){
                await this.notify(`El precio del producto ${product.name} en Mercado libre a cambiado`)
                await this.productService.updateProduct(product.id, {meli_price: value_meli_price})
                

            }


        }
    }

    async notify(message){
        const transport = nodemailer.createTransport({
            host: "simonmartinez1605@gmail.com", 
            port: 465, 
            secure: true, 
            auth: {
                user: process.env.EMAIL, 
                pass: process.env.PASS
            }
        })

        await transport.sendMail({
            from: process.env.EMAIL, 
            to: process.env.EMAIL, 
            subject: "Actualizacion de precios", 
            text: message
        })
    }
}