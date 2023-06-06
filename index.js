require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 8084
const category = require('./routes/Category');
const user = require('./routes/User');

app.use(cors());
app.use(express.urlencoded({extended : false}))
app.use(express.json())
app.get("/",(req,res)=>{
    res.send("Hello world")
});
app.use("/category",category)
app.use("/user",user)

app.listen(PORT,()=>{
    console.log(`Server running on http://localhost:${PORT}`);
});
