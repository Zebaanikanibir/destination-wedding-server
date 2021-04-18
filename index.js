const express = require('express')
const MongoClient = require('mongodb').MongoClient;
const fileUpload =require('express-fileupload');
const objectId = require('mongodb').ObjectID
const cors = require('cors');
const app = express()
require('dotenv').config();
const port = 5011


app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }));
app.use(express.static('services'))
app.use(fileUpload())
const uri =`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.x4chh.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
console.log(uri)
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const serviceCollection = client.db("wedding").collection("services");
  const bookingCollection = client.db("wedding").collection("booking");
  const reviewCollection = client.db("wedding").collection("review");
  const adminCollection = client.db("wedding").collection("admin");

app.post('/addService', (req,res)=>{
  const file = req.files.file
  const name = req.body.name
  const info = req.body.info
  const cost = req.body.cost
 console.log(file, info, name, cost)
 const newImg = file.data
 const encImg = newImg.toString('base64')
 
 var image = {
   contentType: file.mimetype,
   size: file.size,
   img: Buffer.from(encImg, 'base64')
 };
 serviceCollection.insertOne({ name, info, image,cost })
             .then(result => {
                
                res.send(result.insertedCount > 0);
                
                 
             })
 
  })
 

  app.get('/services', (req, res) => {
    serviceCollection.find({})
        .toArray((err, documents) => {
            res.send(documents);
            console.log(documents)
        })
  });


  app.get('/booking/:id', (req, res) => {


    serviceCollection.find({ _id: objectId(req.params.id) })

      .toArray((err, documents) => {
        res.send(documents[0])
      })
  })
  app.post('/addBooking', (req, res) => {

    const order = req.body
  console.log(order)
    bookingCollection.insertOne(order)
      .then(result => {

        console.log(result.insertedCount)
        res.send(result.insertedCount > 0)

      })


})

app.get('/booking',(req, res)=>{
console.log('email',req.query.email)
  bookingCollection.find({email: req.query.email})
.toArray((err, documents)=>{

  res.send(documents);
})
})
app.get('/bookingList',(req, res)=>{
    bookingCollection.find({})
  .toArray((err, documents)=>{
  
    res.send(documents);
  })
  })
  app.delete('/delete/:id', (req, res) => {

    bookingCollection.deleteOne({ _id: objectId(req.params.id) })
    
    .then(result =>{
      console.log(result)
    })

  })





  app.post('/addReview', (req,res)=>{
    const file = req.files.file
    const name = req.body.name
    const cName = req.body.cName
    const description = req.body.description
   console.log(file, cName, name, description)
   const newImg = file.data
   const encImg = newImg.toString('base64')
   
   var image = {
     contentType: file.mimetype,
     size: file.size,
     img: Buffer.from(encImg, 'base64')
   };
   reviewCollection.insertOne({ name, cName, image,description })
               .then(result => {
                  
                  res.send(result.insertedCount > 0);
                  
                   
               })
   
    })

    app.get('/admin', (req, res) => {
      adminCollection.find({})
          .toArray((err, documents) => {
              res.send(documents);
              console.log(documents)
          })
    });

    app.post('/isAdmin', (req, res) => {
      const email = req.body.email;
      console.log(email)
      adminCollection.find({ email: email })
          .toArray((err, admin) => {
              res.send(admin.length > 0);
          })
    })
    

    app.get('/reviews', (req, res) => {
      reviewCollection.find({})
          .toArray((err, documents) => {
              res.send(documents);
              console.log(documents)
          })
    });

    app.post('/addAAdmin', (req,res)=>{
      
      const name = req.body.name
      const email = req.body.email
     console.log(email, name)
     
     adminCollection.insertOne({ name, email })
                 .then(result => {
                    
                    res.send(result.insertedCount > 0);
                    
                     
                 })
     
      })



})







app.get('/', (req, res) => {
  res.send('Hello World!')
})










app.listen(process.env.PORT || port)