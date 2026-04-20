const ClothingItem = require("../models/ClothingItem");
const { BAD_REQUEST_STATUS_CODE, NOT_FOUND_STATUS_CODE, INTERNAL_SERVER_ERROR_STATUS_CODE } = require("../utils/errors");

const getItems = (req, res) => {
  User.find({})
    .then((items) => {
      res.status(200).send(items);
    })
    .catch((err) => {
      console.error(err);
      return res.status(INTERNAL_SERVER_ERROR_STATUS_CODE).send({ message: "An error has occurred on the server."});
    });
};

const createItem = (req, res) => {
  const { name, weather, imageUrl, owner } = req.body;

  User.create({ name, weather, imageUrl, owner })
    .then((item) => {
      res.status(201).send(item);
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res.status(BAD_REQUEST_STATUS_CODE).send({ message: err.message });
      }
      return res.status(INTERNAL_SERVER_ERROR_STATUS_CODE).send({ message: "An error has occurred on the server." });
    });
};

const deleteItem = (req, res) => {
    User.findByIdAndDelete(req.params.id)
    .orFail()
    .then((item) => {
        res.status(200).send(item);
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return res.status(NOT_FOUND_STATUS_CODE).send({ message: "Requested resource not found" });
      } else if (err.name === "CastError") {
        return res.status(BAD_REQUEST_STATUS_CODE).send({ message: err.message });
      }
      return res.status(INTERNAL_SERVER_ERROR_STATUS_CODE).send({ message: "An error has occurred on the server." });
    })
}

module.exports = { getItem, createItem, deleteItem};
module.exports.createClothingItem = (req, res) => {
  console.log(req.user._id);
};