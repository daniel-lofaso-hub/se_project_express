const router = require("express").Router();

const { createUser, login } = require("../controllers/users");
const userRouter = require("./users");
const clothingItemsRouter = require("./clothingItems");
const NotFoundError = require("../errors/not-found-err");

const {
  validateLoginBody,
  validateUserBody,
} = require("../middlewares/validation");

router.post("/signin", validateLoginBody, login);
router.post("/signup", validateUserBody, createUser);
router.use("/users", userRouter);
router.use("/items", clothingItemsRouter);
router.use((req, res, next) => {
  next(new NotFoundError("Requested resource not found"));
});

module.exports = router;
