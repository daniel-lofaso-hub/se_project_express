const ClothingItem = require("../models/clothingItem");
const {
  BAD_REQUEST,
  NOT_FOUND,
  INTERNAL_SERVER_ERROR,
  FORBIDDEN,
} = require("../utils/errors");

const badRequestError = require("../errors/bad-request-err");
const notFoundError = require("../errors/not-found-err");
const internalServerError = require("../errors/internal-server-err");
const forbiddenError = require("../errors/forbidden-err");

const getItems = (req, res) => {
  ClothingItem.find({})
    .then((items) => {
      res.status(200).send(items);
    })
    .catch((err) => {
      console.error(err);
      return next(
        new internalServerError("An error has occurred on the server.")
      );
    });
};

const createItem = (req, res) => {
  console.log(req.user._id);
  const { name, weather, imageUrl } = req.body;

  ClothingItem.create({ name, weather, imageUrl, owner: req.user._id })
    .then((item) => {
      res.status(201).send(item);
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return next(new badRequestError("Invalid data"));
      }
      return next(
        new internalServerError("An error has occurred on the server.")
      );
    });
};

const deleteItem = async (req, res) => {
  try {
    const item = await ClothingItem.findById(req.params.itemId);

    if (!item) {
      return next(new notFoundError("Requested resource not found"));
    }

    if (!item.owner.equals(req.user._id)) {
      return next(
        new forbiddenError("You do not have permission to delete this item.")
      );
    }

    await item.deleteOne();
    return res.status(200).send(item);
  } catch (err) {
    console.error(err);
    if (err.name === "CastError") {
      return next(new badRequestError("Invalid item ID"));
    }
    return next(
      new internalServerError("An error has occurred on the server.")
    );
  }
};

const likeItem = (req, res) => {
  console.log(req.user._id);

  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .orFail()
    .then((item) => {
      res.status(200).send(item);
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return next(new notFoundError("Requested resource not found"));
      }
      if (err.name === "CastError") {
        return next(new badRequestError("Invalid data"));
      }
      return next(
        new internalServerError("An error has occurred on the server.")
      );
    });
};

const unlikeItem = (req, res) => {
  console.log(req.user._id);

  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .orFail()
    .then((item) => {
      res.status(200).send(item);
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return next(new notFoundError("Requested resource not found"));
      }
      if (err.name === "CastError") {
        return next(new badRequestError("Invalid data"));
      }
      return next(
        new internalServerError("An error has occurred on the server.")
      );
    });
};

module.exports = { getItems, createItem, deleteItem, likeItem, unlikeItem };
