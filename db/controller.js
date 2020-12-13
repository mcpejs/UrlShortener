const db = require("./db");
const shortid = require("shortid");
const controller = {};

const urlmap = db.get("urlmap");

controller.shortList = () => {
  return urlmap.value();
};
controller.createShortUrl = (url) => {
  if (urlmap.find({ url }).value()) return false;
  const randomhash = shortid.generate();
  urlmap.push({ id: randomhash, url, visitCount: 0 }).write();
  return randomhash;
};

controller.getUrl = (id) => {
  const temp = urlmap.find({ id }).value();
  if (!temp) return false;
  return temp.url;
};

controller.getId = (url) => {
  const temp = urlmap.find({ url }).value();
  if (!temp) return false;
  return temp.id;
};

controller.isExist = (arg) => {
  if (controller.getUrl(arg)) return true;
  if (controller.getId(arg)) return true;
  return false;
};

controller.delete = (id) => {
  urlmap.remove({ id }).write();
  return;
};

controller.getVisitCount = (id) => {
  const temp = urlmap.find({ id }).value();
  if (!temp) return false;
  return temp.visitCount;
};

controller.increaseVisitCount = (id) => {
  const target = urlmap.find({ id });
  const currentVisitCount = target.value().visitCount;
  target.assign({ visitCount: currentVisitCount + 1 }).write();
  return;
};

module.exports = controller;
