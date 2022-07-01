require("dotenv").config();
const { s3Uploadv2 } = require("../aws/s3");

const User = require("../models/user")

exports.upload = async (req, res, next) => {
    try {
        const user = await User.findOne({where: { id: req.userId, status: true, isAdmin: true}});
        if (!user) {
            const error = new Error("Unauthorized user")
            error.status = 403;
            throw error;
        }
        const results = await s3Uploadv2(req.files);
        console.log(results)
        return res.json({ status: "success" });
    } catch (error) {
        next(error);
    }
};