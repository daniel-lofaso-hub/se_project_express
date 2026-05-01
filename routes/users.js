const router = require("express").Router();
const {
  getCurrentUser,
  createUser,
  login,
  updateUser,
} = require("../controllers/users");
const auth = require("../middlewares/auth");

router.get("/users/me", auth, getCurrentUser);
router.patch("/users/me", auth, updateUser);
router.post("/signin", login);
router.post("/signup", createUser);

module.exports = router;
