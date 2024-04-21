import mongoose from "mongoose";

export const connection = mongoose.connect(
    'mongodb+srv://simonmartinez1605:OhH34JlRZ9nYpZNX@cluster0.bf1uebt.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'
).then((db)=>{
    console.log(`Connected`)
}).catch((err)=>{
    console.log(`Error ${err}`) 
})
