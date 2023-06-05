require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT || 8084

app.get("/",(req,res)=>{
    res.send("Hello world")
});


app.listen(()=>{
    console.log(`Server running on http://localhost:${PORT}`);
});
