const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { HTTP_STATUS_CODES, JWT_SECRET } = require("../utils/constants");

const createUser = (req, res) => {
  const { name, avatar, email, password } = req.body;

  bcrypt
    .hash(password, 10)
    .then((hashedPassword) => {
      return User.create({
        name,
        avatar,
        email,
        password: hashedPassword,
      });
    })
    .then((user) => {
      const userData = {
        _id: user._id,
        name: user.name,
        avatar: user.avatar,
        email: user.email,
      };
      res.status(HTTP_STATUS_CODES.OK).send(userData);
    })
    .catch((err) => {
      console.error(err);

      if (err.name === "ValidationError") {
        return res
          .status(HTTP_STATUS_CODES.BAD_REQUEST)
          .send({ message: "Invalid data provided" });
      }

      if (err.code === 11000) {
        return res
          .status(HTTP_STATUS_CODES.CONFLICT)
          .send({ message: "Email already exists" });
      }

      return res
        .status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR)
        .send({ message: "An error has occurred on the server" });
    });
};

const login = (req, res) => {
  const { email, password } = req.body;

  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      res.send({ token });
    })
    .catch((err) => {
      console.error(err);
      res
        .status(HTTP_STATUS_CODES.UNAUTHORIZED)
        .send({ message: "Incorrect email or password" });
    });
};

const getCurrentUser = (req, res) => {
  const userId = req.user._id;

  User.findById(userId)
    .then((user) => res.status(HTTP_STATUS_CODES.OK).send(user))
    .catch((err) => {
      console.error(err);

      if (err.name === "DocumentNotFoundError") {
        return res
          .status(HTTP_STATUS_CODES.NOT_FOUND)
          .send({ message: "Requested resource not found" });
      }

      if (err.name === "CastError") {
        return res
          .status(HTTP_STATUS_CODES.BAD_REQUEST)
          .send({ message: "Invalid data provided" });
      }

      return res
        .status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR)
        .send({ message: "An error has occurred on the server" });
    });
};

const updateCurrentUser = (req, res) => {
  const userId = req.user._id;
  const { name, avatar } = req.body;

  User.findByIdAndUpdate(
    userId,
    { name, avatar },
    {
      new: true,
      runValidators: true,
    }
  )
    .then((user) => res.status(HTTP_STATUS_CODES.OK).send(user))
    .catch((err) => {
      console.error(err);

      if (err.name === "ValidationError") {
        return res
          .status(HTTP_STATUS_CODES.BAD_REQUEST)
          .send({ message: "Invalid data provided" });
      }

      if (err.name === "DocumentNotFoundError") {
        return res
          .status(HTTP_STATUS_CODES.NOT_FOUND)
          .send({ message: "Requested resource not found" });
      }

      return res
        .status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR)
        .send({ message: "An error has occurred on the server" });
    });
};

module.exports = {
  createUser,
  login,
  getCurrentUser,
  updateCurrentUser,
};
