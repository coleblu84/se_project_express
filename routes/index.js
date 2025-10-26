const router = require("express").Router();
const { HTTP_STATUS_CODES } = require("../utils/constants");

const { createUser, login } = require("../controllers/users");
const usersRouter = require("./users"); 
const itemsRouter = require("./clothingItems");
const auth = require("../middlewares/auth");

router.post("/signup", createUser);
router.post("/signin", login);
router.use("/items", itemsRouter);

router.use("/users", auth, usersRouter);

router.use((req, res) => {
  res
    .status(HTTP_STATUS_CODES.NOT_FOUND)
    .json({ message: "Requested resource not found" });
});

module.exports = router;
