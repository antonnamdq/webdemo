const express = require('express')
const hbs = require('hbs')
const mongodb = require('mongodb');
var MongoClient = require('mongodb').MongoClient;

const app = express();
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: false}));

app.use(express.static(__dirname + '/public'));

app.set('view engine','hbs');
hbs.registerPartials(__dirname +'/views/partials')

var url = 'mongodb+srv://antonnamdq:Nam10112000@cluster0.mlkff.mongodb.net/test';

app.get('/', async (req, res)=>{
    let client = await MongoClient.connect(url, { useUnifiedTopology: true });
    let dbo = client.db("ToyDB");
    let results = await dbo.collection("products").find({}).toArray();
    res.render('index', {model:results})
})

app.get('/',(req, res)=>{
    res.render('index');
})

app.get('/new',(req,res)=>{
    res.render('newProduct');
})

app.get('/insert',(req, res)=>{
    res.render('newProduct');
})

app.post('/doInsert', async (req, res)=>{
    let nameInput = req.body.txtName;
    let priceInput = req.body.txtPrice;
    let sizeInput = req.body.txtSize;
    let originInput = req.body.txtOrigin;

    let client = await MongoClient.connect(url);
    let dbo = client.db("ToyDB");
    let newProduct = {productName : nameInput, price : priceInput, size : sizeInput, origin : originInput};
    await dbo.collection("products").insertOne(newProduct)
    res.redirect('/');
})

app.post('/doSearch', async (req, res)=>{
    let nameInput = req.body.txtName;
    let client = await MongoClient.connect(url);
    let dbo = client.db("ToyDB");

    let results = await dbo.collection("products").find({productName:nameInput}).toArray();
    res.render('index', {model:results})
})

app.get('/delete', async (req, res)=>{
    let id = req.query.id;
    var ObjectID = require('mongodb').ObjectID;
    let condition = {"_id" : ObjectID(id)};

    let client = await MongoClient.connect(url);
    let dbo = client.db("ToyDB");
    await dbo.collection('products').deleteOne(condition)
    res.redirect('/');
})

app.get('/edit', async (req, res)=>{
    let id = req.query.id;
    var ObjectID = require('mongodb').ObjectID;

    let client = await MongoClient.connect(url);
    let dbo = client.db("ToyDB");
    let result = await dbo.collection('products').findOne({"_id" : ObjectID(id)});
    res.render('update', {model : result});
})

app.post('/doUpdate',async (req,res)=>{
    let idF= req.body.id;
    let nameF = req.body.txtName;
    let priceF = req.body.txtPrice;
    let sizeF = req.body.txtSize;
    let originF = req.body.txtOrigin;
    
    //Conver id to ObjectId
    let id = new mongodb.ObjectID(idF);
    let client = await MongoClient.connect(url, {useUnifiedTopology : true});
    let dbo = client.db('ToyDB');
    
    //Do update
    let condition = {_id : id};
    await dbo.collection('products').updateOne(condition, {$set: {productName : nameF, price : priceF, size : sizeF, origin : originF}});
    res.redirect('/');

})

var PORT = process.env.PORT || 3000
app.listen(PORT)
console.log("Server is running...")