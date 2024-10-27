const dbConnection = require("./config/database");
const app = require("./index");


// server-
app.listen(process.env.PORT, async ()=>{
    try{
        await dbConnection;
        console.log("Database connected successfully");
        console.log(`Server is successfully running on PORT ${process.env.PORT}`);
    }
    catch(error){
        console.log("Database not connected");
        console.log("OOP's something is wrong, server is not running")
    }
})