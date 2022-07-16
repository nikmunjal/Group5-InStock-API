const express = require("express");
const router = express.Router();
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");
// const { body, validationResult } = require("express-validator");
router.use(express.json());
const inventoryData = require("../data/inventories.json");
const warehouseData = require("../data/warehouses.json");
const e = require("express");

const isValidateEmail = (email) => {
    return String(email)
        .toLowerCase()
        .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
};

const isValidPhoneNumber = (phone) => {
    const phoneRegularExpression =
        /^\+?([0-9]{2})\)?[-. ](?([0-9]{3})[-. ])?([0-9]{3})[-. ]?([0-9]{4})$/;
    return phone.value.match(phoneRegularExpression);
};

router.get("/", (req, res) => res.status(200).send(warehouseData));

//To delete a specific warehouse
router.delete("/:id", (req, res) => {
    const {
        params: { id },
    } = req;
    warehouse =
        warehouseData.filter(({ id: warehouseID }) => id !== warehouseID) &&
        inventoryData.filter(({ id: warehouseID }) => id !== warehouseID);
    return res.json(warehouse);
});

//To add a warehouse
router.post("/", (req, res) => {
    // try {
    // if (warehouseData) {
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

    // if (
    //     name &&
    //     address &&
    //     city &&
    //     country &&
    //     contactName &&
    //     postion &&
    //     isValidPhoneNumber(phone) &&
    //     isValidateEmail(email)
    // )
    //}
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
    // fs.writeFileSync('data/warehouses.json', JSON.stringify(warehouseData))
    res.status(201).json(warehouseData);
    // .send("The Warehouse has been Uploaded");
    // } else {
    //     res.status(404).json({
    //         errorDetails: "All fields are required",
    //     });
    // }
    // } else {
    //     res.status(404).json({ errorDetails: "warehouse was not found" });
    // }
    // } catch (error) {
    //     res.sendStatus(500);
    // }
});

module.exports = router;
