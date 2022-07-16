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
    return res.json(itemDetails);
})

module.exports = router;