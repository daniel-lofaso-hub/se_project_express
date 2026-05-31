const ClothingItem = require("../models/clothingItem");

const BadRequestError = require("../errors/bad-request-err");
const NotFoundError = require("../errors/not-found-err");
const ForbiddenError = require("../errors/forbidden-err");

const getItems = (req, res, next) => {
  ClothingItem.find({})
    .then((items) => {
      res.status(200).send(items);
    })
    .catch((err) => {
      console.error(err);
      return next(err);
    });
};

const createItem = (req, res, next) => {
  console.log(req.user._id);
  const { name, weather, imageUrl } = req.body;

  ClothingItem.create({ name, weather, imageUrl, owner: req.user._id })
    .then((item) => {
      res.status(201).send(item);
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return next(new BadRequestError("Invalid data"));
      }
      return next(err);
    });
};

const deleteItem = async (req, res, next) => {
  try {
    const item = await ClothingItem.findById(req.params.itemId);

    if (!item) {
      return next(new NotFoundError("Requested resource not found"));
    }

    if (!item.owner.equals(req.user._id)) {
      return next(
        new ForbiddenError("You do not have permission to delete this item.")
      );
    }

    await item.deleteOne();
    return res.status(200).send(item);
  } catch (err) {
    console.error(err);
    if (err.name === "CastError") {
      return next(new BadRequestError("Invalid item ID"));
    }
    return next(err);
  }
};

const likeItem = (req, res, next) => {
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
        return next(new NotFoundError("Requested resource not found"));
      }
      if (err.name === "CastError") {
        return next(new BadRequestError("Invalid data"));
      }
      return next(err);
    });
};

const unlikeItem = (req, res, next) => {
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
        return next(new NotFoundError("Requested resource not found"));
      }
      if (err.name === "CastError") {
        return next(new BadRequestError("Invalid data"));
      }
      return next(err);
    });
};

module.exports = { getItems, createItem, deleteItem, likeItem, unlikeItem };
