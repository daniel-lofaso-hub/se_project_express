const router = require("express").Router();
const {
  getItems,
  createItem,
  deleteItem,
  likeItem,
  unlikeItem,
} = require("../controllers/clothingItems");
const auth = require("../middlewares/auth");
const {
  validateItemBody,
  validateItemId,
} = require("../middlewares/validation");

router.get("/", getItems);
router.post("/", auth, validateItemBody, createItem);
router.delete("/:itemId", auth, validateItemId, deleteItem);
router.put("/:itemId/likes", auth, validateItemId, likeItem);
router.delete("/:itemId/likes", auth, validateItemId, unlikeItem);

module.exports = router;
