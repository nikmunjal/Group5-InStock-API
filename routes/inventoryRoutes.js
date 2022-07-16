const express = require( 'express' );
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
router.use(express.json());
const inventoryData = require( '../data/inventories.json' );
const warehouseData = require( '../data/warehouses.json' );

router.get('/',(req, res) =>
res.status(200).send(inventoryData)
)

module.exports = router;