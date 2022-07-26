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
router.put('/edit/:id', (req, res) => {
        const id = req.params.id;

        let selectedInventory = inventoryData.find((inventory) => {
            inventory.id === id
        });

        const {itemName, warehouseName, description, category, status, quantity } = req.body;

        const itemNameValidity = itemName.length > 0;
        const warehousenNameValidity = warehouseName.length > 0;
        const descriptionValidity = description.length > 0;
        const categoryValidity = category.length > 0;
        const statusValidity = status.length > 0

        if (
            !itemNameValidity ||
            !warehousenNameValidity ||
            !descriptionValidity ||
            !categoryValidity ||
            !statusValidity
        ) {
            res.status(400).send("One or more input fields is missing or invalid")
        }

        selectedInventory = {

            warehouseName:warehouseName,
            itemName:itemName,
            description:description,
            category:category,
            status:status,
            quantity:quantity,
        };

        console.log(selectedInventory);

        inventoryData.map((invArr) => {
            if (invArr.id === selectedInventory.id) {
                return(invArr = selectedInventory);
            }
        });
        inventoryData.push(selectedInventory);
        fs.writeFile(
            "./data/inventories.json",
            JSON.stringify(inventoryData),
            (err) => {
                if (err) {
                    res.status(500).send(err);
                }
                console.log("File Edited Successfully")
                res.status(201).json(inventoryData);
            })
});





// Add a new inventory item to a certain warehouse
router.post("/", (req, res) => {
    let findWarehouse = warehouseData.find(warehouse => req.body.warehouseName === warehouse.name)
    const { warehouseName, itemName, description, category, status, quantity } = req.body;

    if (!findWarehouse) {
        return res.status(404).send("Cannot locate warehouse")
    }

    if (
        !warehouseName ||
        !itemName ||
        !description ||
        !category ||
        !status ||
        !quantity === undefined
    ) {
        return res.status(400).send("One or more form values is missing or invalid.");
    } else if (Number(quantity) !== JSON.parse(quantity)) {
        return res.status(400).send("Quantity input is invalid");
    } else if (status !== "In Stock" && status !== "Out of Stock") {
        return res.status(400).send("Status input is invalid");
    } else {

        const newInventory = {
            id: uuidv4(),
            warehouseID: findWarehouse.id,
            warehouseName: warehouseName,
            itemName: itemName,
            description: description,
            category: category,
            status: status,
            quantity: quantity,
        };

        inventoryData.push(newInventory);
        fs.writeFile("./data/inventories.json", JSON.stringify(inventoryData),
            (err) => {
                if (err) {
                    res.status(500).send(err);
                }
                    console.log("File written successfully!");
                    res.status(201).send(newInventory);
            });
        }
    });


//      DELETE SINGLE INVENTORY ITEM
router.delete('/:id', (req,res) => {
    const {id} = req.params;

    const deleteItem = inventoryData.filter(( {id:itemId} ) => id !== itemId );
    fs.writeFileSync("./data/inventories.json", JSON.stringify(deleteItem));
    return res.status(201).json(deleteItem);

})


module.exports = router;