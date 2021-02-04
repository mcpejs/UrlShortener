const shortid = require("shortid");
const db = require("./lowdb.js");

const controller = {};

controller.export = () => db.value();

controller.import = (json) => {
  db.remove().write();
  db.push(json).write();
  db.remove((a) => a === null).write();
};

controller.createShortUrl = (url) => {
  if (db.find({ url }).value()) return false;
  const randomhash = shortid.generate();
  db.push({ id: randomhash, url, visitCount: 0 }).write();
  return randomhash;
};

controller.getUrl = (id) => {
  const temp = db.find({ id }).value();
  if (!temp) return false;
  return temp.url;
};

controller.getId = (url) => {
  const temp = db.find({ url }).value();
  if (!temp) return false;
  return temp.id;
};

controller.isExist = (arg) => {
  if (controller.getUrl(arg)) return true;
  if (controller.getId(arg)) return true;
  return false;
};

controller.delete = (id) => {
  db.remove({ id }).write();
  return;
};

controller.getVisitCount = (id) => {
  const temp = db.find({ id }).value();
  if (!temp) return false;
  return temp.visitCount;
};

controller.increaseVisitCount = (id) => {
  const target = db.find({ id });
  const currentVisitCount = target.value().visitCount;
  target.assign({ visitCount: currentVisitCount + 1 }).write();
  return;
};

module.exports = controller;
