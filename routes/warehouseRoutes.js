const express = require("express");
const router = express.Router();
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");
router.use(express.json());
const inventoryData = require("../data/inventories.json");
const warehouseData = require("../data/warehouses.json");
const e = require("express");

// To Validate the Email
const isValidateEmail = (email) => {
    const emailRe =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return emailRe.test(email);
};

// To Validate the Phone Number
const isValidPhoneNumber = (phone) => {
    const phoneRe =
        /^(\+{0,})(\d{0,})[-. ]([(]{1}\d{1,3}[)]{0,}){0,}(\s?\d+|\+\d{2,3}\s{1}\d+|\d+){1}[\s|-]?\d+([\s|-]?\d+){1,2}(\s){0,}$/gm;
    return phoneRe.test(phone);
};

// retrieving data for all warhouses
router.get("/", (req, res) => res.status(200).send(warehouseData));

// retrieving data from single warhouse

router.get("/:id", (req, res) => {
    let warehouse = warehouseData.find((warehouse) => {
        return warehouse.id === req.params.id;
    });

    if (warehouse) res.json(warehouse);
    else res.status(404).send("That warehouse was not found");
});
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

// grabbing the inventories of warehouses by their id

router.get("/:id/inventory", (req, res) => {
    const findInv = inventoryData.find(
        (inv) => inv.warehouseID === req.params.id
    );
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
});

// To add a warehouse
router.post("/", (req, res) => {
    try {
        if (warehouseData) {
            const {
                name,
                address,
                city,
                country,
                contactName,
                position,
                phone,
                email,
            } = req.body;

            if (
                name &&
                address &&
                city &&
                country &&
                contactName &&
                position &&
                isValidPhoneNumber(phone) &&
                isValidateEmail(email)
            ) {
                warehouseData.push({
                    id: uuidv4(),
                    name: name,
                    address: address,
                    city: city,
                    country: country,
                    contact: {
                        name: contactName,
                        position: position,
                        phone: phone,
                        email: email,
                    },
                });
                fs.writeFileSync(
                    "data/warehouses.json",
                    JSON.stringify(warehouseData)
                );
                res.status(201)
                    .json(warehouseData)
                    .send("The Warehouse has been Uploaded");
            } else {
                res.status(404).json({
                    errorDetails: "All fields are required",
                });
            }
        } else {
            res.status(404).json({
                errorDetails: "warehouse data was not found",
            });
        }
    } catch (error) {
        console.log("Error: 500");
    }
});

// To Edit a Warehouse
router.put("/:id", (req, res) => {
    try {
        const id = req.params.id;
        if (warehouseData) {
            const {
                name,
                address,
                city,
                country,
                contactName,
                position,
                phone,
                email,
            } = req.body;

            if (
                name ||
                address ||
                city ||
                country ||
                contactName ||
                position ||
                isValidPhoneNumber(phone) ||
                isValidateEmail(email)
            ) {
                let warehouse = warehouseData.filter(
                    (warehouse) => warehouse.id === id
                );
                let warehouses = warehouseData.filter(
                    (warehouse) => warehouse.id !== id
                );

                warehouse = {
                    id: id,
                    name: name,
                    address: address,
                    city: city,
                    country: country,
                    contact: {
                        name: contactName,
                        position: position,
                        phone: phone,
                        email: email,
                    },
                };
                warehouses.push(warehouse);
                fs.writeFileSync(
                    "data/warehouses.json",
                    JSON.stringify(warehouses)
                );
                res.status(201)
                    .json(warehouses)
                    .send("The Warehouse has been updated");
            } else {
                res.status(404).json({
                    errorDetails: "All fields are required",
                });
            }
        } else {
            res.status(404).json({
                errorDetails: "warehouse data was not found",
            });
        }
    } catch (error) {
        console.log("Error: 500");
    }
});

module.exports = router;
