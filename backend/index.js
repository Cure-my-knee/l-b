const app = require("./app")

const server=app.listen(5000,() =>{
    console.log("Your App is running on port http://localhost:5000/");
})