const express = require("express");
const app = express();
const pool = require("./db")

app.use(express.json())

//Create Item
app.post("/food", async(req,res) => {
    try{
        console.log(req.body);
        const { upc, name, description,packagesize } = req.body;
        const newItem = await pool.query("INSERT INTO food (UPC,name,description,packagesize) VALUES ($1,$2,$3,$4) RETURNING *",[upc,name,description,packagesize]);

        res.json(newItem);
    }catch(err){
        console.error(err.message);
    }
})

//Get item
app.get("/food/:upc",async(req, res) => {
    try{
        const { upc }  = req.params;
        const returnedItem = await pool.query("SELECT upc, name, description FROM food WHERE upc = ($1)",[ upc ]);
        res.json(returnedItem);
    }catch(err){
        console.error(err.message);
    }
})

//Update Item
app.put("/food/:upc",async(req,res) => {
    try{
        const { upc } = req.params;
        const { name } = req.body;
        const updateItem = await pool.query("UPDATE food SET name = ($1) WHERE upc = ($2)",[ name, upc ]);
        //only really needed if we feel like verifying that the change actually took place
        res.json(updateItem);
    }catch(err){
        console.error(err.message);
    }
})

//Delete Item
app.delete("/food/:upc",async(req,res) => {
    try{
        const { upc } = req.params;
        const returnedData = await pool.query("DELETE FROM food WHERE upc = ($1)", [ upc ]);
        res.json("item deleted");
    }catch(err){
        console.error(err.message);
    }
})

app.listen(3000, () => {
    console.log("Server listening on port 3000...");
});