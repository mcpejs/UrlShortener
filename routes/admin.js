const router = require("express").Router();
const { resolve } = require("path");
const controller = require("../db/controller");

router.get("/commands", (req, res) => {
  res.sendFile(resolve("./views/commands.html"));
});

const inputTemplate = (
  path,
  placeholder,
  name
) => `<form action="/admin/${path}" method="POST">
<input type="text" placeholder="${placeholder}" name="${name}" />
<input type="text" placeholder="비밀번호" name="password" />
<input type="submit">
</form>`;

router.get("/create", (req, res) => {
  res.send(inputTemplate("createShorturl", "단축할 url", "url"));
});

router.get("/import", (req, res) => {
  res.send(inputTemplate("import", "입력할 내용", "list"));
});

const passOnlyTemplate = (path) => `<form action="/admin/${path}" method="POST">
<input type="text" placeholder="비밀번호" name="password" />
<input type="submit">
</form>`;

router.get("/list", (req, res) => {
  res.send(passOnlyTemplate("list"));
});

router.get("/export", (req, res) => {
  res.send(passOnlyTemplate("export"));
});

const adminAuth = (req, res, next) => {
  if (!req.body.password || req.body.password != process.env.ADMIN_PASSWORD) {
    res.send("비밀번호 틀림");
    return;
  }
  next();
};

router.post("/list", adminAuth, (req, res) => {
  const data = controller.export();
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

router.post("/export", adminAuth, (req, res) => {
  const raw = JSON.stringify(controller.export());
  const result = raw.slice(1, raw.length);
  res.send(result);
});

router.post("/import", adminAuth, (req, res) => {
  const data = JSON.parse(req.body.list);
  controller.import(data);
  res.send("ok");
});
module.exports = router;
