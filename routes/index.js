const router = require("express").Router();
const controller = require("../db/controller");

router.get("/:id", (req, res) => {
  const { id } = req.params;
  const url = controller.getUrl(id);
  if (!url) {
    res.status(404).send("404");
    return;
  }
  controller.increaseVisitCount(id);
  res.redirect(url);
});

module.exports = router;
