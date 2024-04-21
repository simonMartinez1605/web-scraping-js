import { Product } from "./product";

export class ProductService{
    constructor(){}

    async listProducts(){
        return await Product.find({})
    }

    async updateProduct(productId, data){

    }
}