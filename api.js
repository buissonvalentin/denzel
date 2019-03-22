const Express = require("express");


var app = Express();
var PORT = process.env.PORT || 8080;


app.get('/', (req, res) =>{
    res.send("Hello");
});

app.get('*', (req, res) =>{
    res.send("All path");
});

app.listen(PORT);
console.log(`listening on port ${PORT}`);