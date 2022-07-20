const express = require( 'express' );
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
router.use(express.json());
const inventoryData = require( '../data/inventories.json' );
const warehouseData = require( '../data/warehouses.json' );

router.get('/',(req, res) =>
res.status(200).send(inventoryData)
);

//      GET A SINGLE INVENTORY ITEM
router.get('/:id', (req, res) => {
    const {id} = req.params;
    const itemDetails = inventoryData.find (( {id:itemId} ) => id === itemId );
    
    if (typeof(itemDetails) === "undefined") {
        return res.status(404).send("Inventory item not found");
    } else {
        return res.json(itemDetails);
    };
})


//      DELETE SINGLE INVENTORY ITEM
router.delete('/:id', (req,res) => {
    const {id} = req.params;

    const deleteItem = inventoryData.filter(( {id:itemId} ) => id !== itemId );
    
    return res.status(201).json(deleteItem);

})


module.exports = router;