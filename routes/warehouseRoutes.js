const express = require("express");
const router = express.Router();
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");
router.use(express.json());
const inventoryData = require("../data/inventories.json");
const warehouseData = require("../data/warehouses.json");
const e = require("express");

router.get("/", (req, res) => res.status(200).send(warehouseData));

//To delete a specific warehouse
router.delete("/:id", (req, res) => {
    const {
        params: { id },
    } = req;
    const warehouse = warehouseData.filter((warehouse) => warehouse.id !== id);
    const inventory = inventoryData.filter(
        (warehouseInventory) => warehouseInventory.warehouseID !== id
    );
    fs.writeFileSync("data/warehouses.json", JSON.stringify(warehouse));
    fs.writeFileSync("data/inventories.json", JSON.stringify(inventory));
    res.status(201).json(warehouse).send("The Warehouse has been deleted");
});

module.exports = router;
