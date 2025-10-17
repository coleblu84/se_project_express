const Item = require("../models/clothingItem");
const { HTTP_STATUS_CODES } = require("../utils/constants");

const getItems = (req, res) => {
  Item.find({})
    .then((items) => res.status(HTTP_STATUS_CODES.OK).send(items))
    .catch((err) => {
      console.error(err);
      res
        .status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR)
        .send({ message: "An error has occurred on the server" });
    });
};

const createItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;
  const owner = req.user._id;

  Item.create({ name, weather, imageUrl, owner })
    .then((item) => res.status(HTTP_STATUS_CODES.OK).send(item))
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res
          .status(HTTP_STATUS_CODES.BAD_REQUEST)
          .send({ message: "Invalid data provided" });
      }
      return res
        .status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR)
        .send({ message: "An error has occurred on the server" });
    });
};

const deleteItem = (req, res) => {
  const { itemId } = req.params;

  Item.findByIdAndDelete(itemId)
    .orFail()
    .then((item) =>
      res.status(HTTP_STATUS_CODES.OK).send({ message: "Item deleted", item })
    )
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

const likeItem = (req, res) => {
  Item.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .orFail()
    .then((item) => res.status(HTTP_STATUS_CODES.OK).send(item))
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

const dislikeItem = (req, res) => {
  Item.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .orFail()
    .then((item) => res.status(HTTP_STATUS_CODES.OK).send(item))
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

module.exports = {
  getItems,
  createItem,
  deleteItem,
  likeItem,
  dislikeItem,
};
