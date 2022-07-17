const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.PORT || process.argv[2] || 8080;
const inventoryRouter = require("./routes/inventoryRoutes");
const warehouseRouter = require("./routes/warehouseRoutes");
app.use(express.static("public"));
app.use(cors());
// app.use(express.json());

app.use("/inventory", inventoryRouter);
app.use("/warehouse", warehouseRouter);
app.listen(port, (error) =>
    error ? console.error(error) : console.info(`I am running ${port}`)
);
