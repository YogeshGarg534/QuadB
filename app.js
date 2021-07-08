const express = require('express');
const mongoose = require('mongoose');
const fetch = require('node-fetch');



const app = express();
app.set('view engine','ejs');
mongoose.connect("mongodb://localhost:27017/cryptoDB",{useNewUrlParser: true});

const cryptoSchema = new mongoose.Schema({
  name: String,
  lastPrice: Number,
  buyPrice: Number,
  sellPrice: Number,
  volume:Number,
  base:String
},{timestamps: true});

const currency = mongoose.model("currency",cryptoSchema);



app.get("/",function(req,res){

   const url = "https://api.wazirx.com/api/v2/tickers"

   fetch(url)
   .then(res=> res.json())
   .then(function(data){

   const currencyData = data;

   for(i=0;i<10;i++)
   {
     const crypto = new currency({

       name : currencyData[Object.keys(currencyData)[i]].name,
       lastPrice  : currencyData[Object.keys(currencyData)[i]].last,
       buyPrice: currencyData[Object.keys(currencyData)[i]].last,
       sellPrice : currencyData[Object.keys(currencyData)[i]].high,
       volume : currencyData[Object.keys(currencyData)[i]].volume,
       base : currencyData[Object.keys(currencyData)[i]].base_unit
     });

     crypto.save();
   }

   })

   const currencyQuery = currency.find({},null,{limit: 10}).sort({createdAt: 'desc'});
   currencyQuery.exec(function(err, allCurrencies){
     if(err){
       console.log(err);
     }
     else{
       res.render("display",{allCurrencies:allCurrencies})
     }
   })


})









app.listen(3000,function(){
  console.log("Server is running in port 3000");
})
