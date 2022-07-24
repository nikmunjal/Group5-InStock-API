const express = require( 'express' );
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
router.use(express.json());
const inventoryData = require( '../data/inventories.json' );
const warehouseData = require( '../data/warehouses.json' );


//      GET INVENTORY DATA
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
}
);

//      PUT, PATCH, EDIT INVENTORY ITEM
router.put('/:id', (req, res) => {
    try {
        const id = req.params.id;
        if (inventoryData) {
            const {
                itemName,
                description,
                category,
                status,
                warehouseName
            } = req.body;

            if (
                itemName ||
                description ||
                category ||
                status ||
                warehouseName
            ) {
                let inventory = inventoryData.filter(
                    (inventory) => inventory.id === id
                );
                let inventories = inventoryData.filter(
                    (inventory) => inventory.id !== id
                );

                inventory = {
                    itemName: itemName,
                    description: description,
                    category: category,
                    status: status,
                    warehouseName: warehouseName
                };
                inventories.push(inventory);
                fs.writeFileSync(
                    "data/inventories.json",
                    JSON.stringify(inventory)
                );
                res.status(201)
                    .json(inventory)
                    .send("Inventory has been updated");
            } else {
                res.status(404).json({
                    errorDetails: "All fields are required",
                });
            }
        } else {
            res.status(404).json({
                errorDetails: "Inventory data was not found",
            });
        }
    } catch (error) {
        console.log("Error: 500");
    }
});



// Add a new inventory item to a certain warehouse
router.post("/", (req, res) => {
    let findWarehouse = warehouseData.find(warehouse => req.body.warehouseName === warehouse.name)
    const { warehouseName, itemName, description, category, status, quantity} = req.body;

    if (!findWarehouse) {
        return res.status(404).send("Cannot locate warehouse")
    }

    if (
        !warehouseName ||
        !itemName ||
        !description ||
        !category ||
        !status ||
        !quantity
    ) {
        return res.status(400).send("One or more form values is missing or invalid.");
    }

    const newInventory = {
        id: uuidv4(),
        warehouseID: findWarehouse.warehouseID,
        warehouseName: warehouseName,
        itemName: itemName,
        description: description,
        category: category,
        status: status,
        quantity: quantity,
    };

    inventoryData.push(newInventory);
    fs.writeFile(
        "./data/inventories.json",
        JSON.stringify(inventoryData),
        (err) => {
            if (err) {
                res.status(500).send(err);
            }
                console.log("File written successfully!");
                res.status(201).json(inventoryData);
        })
});


//      DELETE SINGLE INVENTORY ITEM
router.delete('/:id', (req,res) => {
    const {id} = req.params;

    const deleteItem = inventoryData.filter(( {id:itemId} ) => id !== itemId );
    
    return res.status(201).json(deleteItem);

})


module.exports = router;