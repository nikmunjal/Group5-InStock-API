const express = require( 'express' );
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
router.use(express.json());
const inventoryData = require( '../data/inventories.json' );
const warehouseData = require( '../data/warehouses.json' );

router.get('/',(req, res) =>
res.status(200).send(warehouseData)
)

// retrieving data from single warhouse 

router.get('/:id', (req, res) => {
    let warehouse = warehouseData.find((warehouse) => {
        return warehouse.id === req.params.id;
    });

    if(warehouse) res.json(warehouse);
    else res.status(404).send("That warehouse was not found");
});

module.exports = router;