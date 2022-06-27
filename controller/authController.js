const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const User = require("../models/user");

exports.signup = async (req, res, next) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const error = new Error("Invalid Data");
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }
    const { email, password } = req.body;

    // SELECT `id`, `email`, `password`, `createdAt`, `updatedAt` FROM `users` AS `user` WHERE `user`.`email` = 'test@example.com'
    const checkEmail = await User.findOne({ where: { email: email } });

    if (checkEmail) {
      const error = new Error(`${email} is already registered`);
      error.statusCode = 422;
      throw error;
    }

    const hashPwd = await bcrypt.hash(password, 12);
    const user = await User.create({ email, password: hashPwd });

    res.status(201).json({ id: user.id, msg: "user created successfully" });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });

    if (!user) {
      const error = new Error("User Not Found");
      error.statusCode = 403;
      throw error;
    }

    const isPwd = await bcrypt.compare(password, user.password);

    if (!isPwd) {
      const error = new Error("Invalid password");
      error.statusCode = 403;
      throw error;
    }

    const token = jwt.sign(
      { email: email, userId: user.id },
      process.env.SECRET_KEY,
      { expiresIn: "1h" }
    );

    res.status(200).json({ msg: "login successful", token: token });
  } catch (err) {
    next(err);
  }
};
