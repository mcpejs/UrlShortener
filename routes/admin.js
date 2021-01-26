const router = require("express").Router();
const { resolve } = require("path");
const controller = require("../db/controller");

router.get("/commands", (req, res) => {
  res.sendFile(resolve("./views/commands.html"));
});
router.get("/create", (req, res) => {
  res.sendFile(resolve("./views/create.html"));
});

router.get("/list", (req, res) => {
  res.sendFile(resolve("./views/list.html"));
});

const adminAuth = (req, res, next) => {
  if (!req.body.password || req.body.password != process.env.ADMIN_PASSWORD) {
    res.send("비밀번호 틀림");
    return;
  }
  next();
};

router.post("/list", adminAuth, (req, res) => {
  const data = controller.shortList();
  const result = [];
  data.map(({ id, url, visitCount }) => {
    result.push(id, url, visitCount, "");
  });
  res.send(result.join("<br>"));
});

router.post("/createShorturl", adminAuth, (req, res) => {
  controller.createShortUrl(req.body.url);
  res.redirect("/admin/list");
});

module.exports = router;
