const express = require("express");
const router = express.Router();

// Routes
router.use("/api/users", require("./UserRoutes"));
router.use("/api/photos", require("./PhotoRoutes"));

// Router test
router.get("/", (req, res) => {
    res.send("The API is working");
});

module.exports = router;