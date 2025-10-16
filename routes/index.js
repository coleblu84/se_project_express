const router = require("express").Router();
const { HTTP_STATUS_CODES } = require("../utils/constants");

const userRouter = require("./users");
const itemsRouter = require("./clothingItems");

router.use("/users", userRouter);
router.use("/items", itemsRouter);

router.use((req, res) => {
  res
    .status(HTTP_STATUS_CODES.NOT_FOUND)
    .json({ message: "Requested resource not found" });
});

module.exports = router;
