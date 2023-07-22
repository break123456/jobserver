const mongoose = require("mongoose");

const Connection = async(URL)=>{
    try {
        await mongoose.connect(URL, {useNewUrlParser: true, useUnifiedTopology: true});
        console.log("Database successfully connected..")
    } catch (error) {
        console.log("Error: ", error.message)
    } 
}

module.exports = Connection;