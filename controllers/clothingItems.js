const Item = require("../models/clothingItem");
const { HTTP_STATUS_CODES } = require("../utils/constants");

const BadRequestError = require("../errors/BadRequestError");
const ForbiddenError = require("../errors/ForbiddenError");
const NotFoundError = require("../errors/NotFoundError");

const getItems = (req, res, next) => {
  Item.find({})
    .then((items) => res.status(HTTP_STATUS_CODES.OK).send(items))
    .catch((err) => next(err));
};

const createItem = (req, res, next) => {
  const { name, weather, imageUrl } = req.body;
  const owner = req.user._id;

  Item.create({ name, weather, imageUrl, owner })
    .then((item) => res.status(HTTP_STATUS_CODES.OK).send(item))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return next(new BadRequestError("Invalid data provided"));
      }

      return next(err);
    });
};

const deleteItem = (req, res, next) => {
  const { itemId } = req.params;
  const currentUserId = req.user._id;

  Item.findById(itemId)
    .orFail()
    .then((item) => {
      if (item.owner.toString() !== currentUserId) {
        throw new ForbiddenError(
          "You do not have permission to delete this item"
        );
      }

      return Item.findByIdAndDelete(itemId).then(() =>
        res.status(HTTP_STATUS_CODES.OK).send({
          message: "Item deleted",
          item,
        })
      );
    })
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        return next(new NotFoundError("Requested resource not found"));
      }

      if (err.name === "CastError") {
        return next(new BadRequestError("Invalid data provided"));
      }

      return next(err);
    });
};

const likeItem = (req, res, next) => {
  Item.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .orFail()
    .then((item) => res.status(HTTP_STATUS_CODES.OK).send(item))
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        return next(new NotFoundError("Requested resource not found"));
      }

      if (err.name === "CastError") {
        return next(new BadRequestError("Invalid data provided"));
      }

      return next(err);
    });
};

const dislikeItem = (req, res, next) => {
  Item.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .orFail()
    .then((item) => res.status(HTTP_STATUS_CODES.OK).send(item))
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        return next(new NotFoundError("Requested resource not found"));
      }

      if (err.name === "CastError") {
        return next(new BadRequestError("Invalid data provided"));
      }

      return next(err);
    });
};

module.exports = {
  getItems,
  createItem,
  deleteItem,
  likeItem,
  dislikeItem,
};
