const express = require("express")
const bodyParser = require("body-parser")
const date = require(__dirname + "/date.js")
const mongoose = require('mongoose')
const app = express()

app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({
  extended: true
}))
app.use(express.static("public"))
mongoose.connect('mongodb://localhost:27017/todoDB', {
  useUnifiedTopology: true,
  useNewUrlParser: true
})

const todoSchema = {
  name: String
}

const Item = mongoose.model('Item', todoSchema)

const item1 = new Item({
  name: 'Practice Ds & Algo'
})

const item2 = new Item({
  name: 'Study new stuff'
})

const item3 = new Item({
  name: 'Develop software'
})

const defaultToDos = [item1, item2, item3]

app.get("/", function (req, res) {
  const day = date.getDate()
  Item.find({}, (e, items) => {
    if (items.length === 0) {
      Item.insertMany(defaultToDos, (e) => {
        console.log(e);
      })
    }
    res.render("list", {
      listTitle: day,
      newListItems: items
    })
  })
})

app.post("/", function (req, res) {
  const item = req.body.newItem
  const newItem = new Item({
    name: item
  })
  newItem.save()
  res.redirect('/')
})

app.post('/delete',function(req,res){
  const item=req.body.delItem
  Item.findByIdAndRemove(item,(e)=>{
    if(!e){
      res.redirect('/')
    }else{
      console.log(e)
    }
  })
})

app.listen(3000, function () {
  console.log("Server started on port 3000")
})