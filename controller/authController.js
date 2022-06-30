const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
require("dotenv").config();

const nodemailer = require("nodemailer");

const User = require("../models/user");

const EMAIL = "hibogo789@gmail.com";

const transporter = nodemailer.createTransport({
  // service: "gmail",
  port: 465,
  host: "smtp.gmail.com",
  secure: true,
  auth: {
    type: "OAuth2",
    user: EMAIL,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    accessToken: process.env.ACCESS_TOKEN,
    refreshToken: process.env.REFRESH_TOKEN,
    expires: 1484314697598,
  },
});

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
    const checkEmail = await User.findOne({ where: { email } });

    if (checkEmail) {
      const error = new Error(`${email} is already registered`);
      error.statusCode = 422;
      throw error;
    }

    const test = "test";
    const signupToken = await bcrypt.hash(email, 10);
    // console.log(signupToken);

    transporter.sendMail({
      to: email,
      from: EMAIL,
      subject: "authorization your account",
      html: `<p>click this <a href=${process.env.SERVER}/auth/signupToken/?token=${signupToken}>link</a></p>`,
    });

    const curr = new Date();
    const KR_TIME_DIFF = 9 * 60 * 60 * 1000;
    const utc = curr.getTime() + curr.getTimezoneOffset() * 60 * 1000;
    const kr_curr = new Date(utc + KR_TIME_DIFF);

    const hashPwd = await bcrypt.hash(password, 12);
    const user = await User.create({
      email,
      password: hashPwd,
      signupToken: signupToken,
      signupTokenExpiration: kr_curr,
    });

    res.status(201).json({ id: user.id, msg: "user created successfully" });
  } catch (error) {
    next(error);
  }
};

// exports.authorizeUser = async (req, res, next) => {
//   try {
//     const signupToken = req.params.signupToken;
//     const user = await User.findOne({ where: { signupToken: signupToken } });
//     if (!user) {
//       const error = new Error("Invalid signup token provided");
//       error.statusCode = 403;
//       throw error;
//     }
//     await user.update({ status: true });

//     res.status(200).json({ msg: "authorization successful", userId: user.id });
//   } catch (error) {
//     next(error);
//   }
// };

exports.authorizeUser = async (req, res, next) => {
  try {
    console.log(req.query);
    const signupToken = req.query.token;
    const user = await User.findOne({ where: { signupToken } });
    console.log(user);

    if (!user) {
      const error = new Error("Invalid signup token provided");
      error.statusCode = 403;
      throw error;
    }

    await user.update({ status: true });

    res.status(200).json({ msg: "authorization successful", userId: user.id });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });

    const status = user.status;

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

    res
      .status(200)
      .json({ msg: "login successful", token: token, userId: user.id, status });
  } catch (err) {
    next(err);
  }
};
