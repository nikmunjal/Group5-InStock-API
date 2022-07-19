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

// grabbing the inventories of warehouses by their id 

router.get("/:id/inventory", (req, res) => {
            const findInv = inventoryData.find((inv) => inv.warehouseID === req.params.id);
        if (findInv) {
            const warehouseInv = inventoryData
            .filter((item) => item.warehouseID === req.params.id)
            .map((inv) => {
                return {
                id: inv.id,
                warehouseID: inv.warehouseID,
                warehouseName: inv.warehouseName,
                itemName: inv.itemName,
                description: inv.description,
                category: inv.category,
                status: inv.status,
                quantity: inv.quantity,
                };
            });
            res.json(warehouseInv);
        } else {
            return res.status(404).send("warehouse has no inventory");
        }
    }
);


module.exports = router;