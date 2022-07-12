const express = require("express");

const router = express.Router();

const signedUrlController = require("../controller/signedURLController")
const isAuth = require("../middleware/isAuth")

router.get("/movies/:id", isAuth, signedUrlController.getSignedUrl);


module.exports = router;