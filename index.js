const express = require("express");
const mongoose = require("mongoose");
const cors=require("cors")
const app = express();
const bodyParser=require( "body-parser" )
const uri ="mongodb+srv://chibhiraj:Chibhiraj@mydb.uzc7ogf.mongodb.net/setit";
const port=3001;

app.use(cors());
app.use(express.json());

mongoose.connect( uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})

const dbConn = mongoose.connection;

dbConn.on("error" , console.error.bind(console, "Connection Error"));
dbConn.on("open", function(){
  console.log("DB Connection succesful");
})

const memberSchema= new mongoose.Schema({
    designation: String,
    location: String,    
    address: String,
    ownerName: String,
    phoneNumber: String,
    productLink: String,
    shopName: String,
});

const user=mongoose.model('members',memberSchema);

app.post('/', async (req, res) => {
  try {
    const { designation, location,address,ownerName,phoneNumber,productLink,shopName } = req.body;
    const newUser = new user({ designation, location,address,ownerName,phoneNumber,productLink,shopName });
    await newUser.save();
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error("Error saving user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get('/', async (req, res) => {
  try {
    const users = await user.find({});
    // console.log(users);
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.put('/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const {designation, location,address,ownerName,phoneNumber,productLink,shopName } = req.body;
    const updatedUser = await user.findByIdAndUpdate(userId, { designation, location,address,ownerName,phoneNumber,productLink,shopName }, { new: true });
    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


app.delete('/:userId', async (req, res) => {
  try {
    const userId = req.params.userId; 
    const deletedUser = await user.findByIdAndDelete(userId);
    if (!deletedUser) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


app.listen(port , () => console.log(`Example app listening on port !`));
