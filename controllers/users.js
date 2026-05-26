const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/user");
const { JWT_SECRET } = require("../utils/config");

const NotFoundError = require("../errors/not-found-err");
const BadRequestError = require("../errors/bad-request-err");
const InternalServerError = require("../errors/internal-server-err");
const ConflictError = require("../errors/conflict-err");
const UnauthorizedError = require("../errors/unauthorized-err");

const getCurrentUser = async (req, res, next) => {
  try {
    const { _id: userId } = req.user;

    const user = await User.findById(userId).orFail();

    return res.status(200).send(user);
  } catch (err) {
    console.error(err);
    if (err.name === "DocumentNotFoundError") {
      return next(new NotFoundError("Requested resource not found"));
    }
    if (err.name === "CastError") {
      return next(new BadRequestError("Invalid data"));
    }
    return next(
      new InternalServerError("An error has occurred on the server.")
    );
  }
};

const createUser = async (req, res, next) => {
  try {
    const { name, avatar, email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      avatar,
      email,
      password: hashedPassword,
    });
    return res.status(201).send(user);
  } catch (err) {
    console.error(err);

    if (err.name === "ValidationError") {
      return next(new BadRequestError("Invalid data"));
    }
    if (err.code === 11000) {
      return next(new ConflictError("A user with this email already exists"));
    }
    return next(
      new InternalServerError("An error has occurred on the server.")
    );
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new BadRequestError("Email and password are required"));
    }

    const user = await User.findUserByCredentials(email, password);

    const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
      expiresIn: "7d",
    });
    return res.send({ token });
  } catch (err) {
    return next(new UnauthorizedError("Incorrect email or password"));
  }
};

const updateUser = async (req, res, next) => {
  try {
    const { _id: userId } = req.user;
    const { name, avatar } = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      { name, avatar },
      { new: true, runValidators: true }
    );

    if (!user) {
      return next(new NotFoundError("Requested resource not found"));
    }

    return res.status(200).send(user);
  } catch (err) {
    console.error(err);
    if (err.name === "ValidationError") {
      return next(new BadRequestError("Invalid data"));
    }
    if (err.name === "DocumentNotFoundError") {
      return next(new NotFoundError("Requested resource not found"));
    }
    return next(
      new InternalServerError("An error has occurred on the server.")
    );
  }
};

module.exports = { getCurrentUser, createUser, login, updateUser };
