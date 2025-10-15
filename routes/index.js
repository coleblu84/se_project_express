const router = require("express").Router();

const userRouter = require("./users");
const itemsRouter = require("./clothingItems");

router.use("/users", userRouter);
router.use("/items", itemsRouter);

app.use('*', (req, res) => {
  res.status(404).json({ message: 'Requested resource not found' });
});

module.exports = router;
