const controller = require("./controller");
const shortid = require("shortid");

let id;
const originalUrl = "https://github.com/mcpejs";

beforeEach(() => {
  controller.delete(controller.getId(originalUrl));
  id = controller.createShortUrl(originalUrl);
});

afterAll(() => {
  controller.delete(controller.getId(originalUrl));
});

test("createShortUrl Work?", () => {
  expect(shortid.isValid(id)).toBe(true);
});

test("getId and getUrl Work?", () => {
  expect(controller.getId(originalUrl)).toBe(id);
  expect(controller.getUrl(id)).toBe(originalUrl);
});

test("isExist Work?", () => {
  expect(controller.isExist(id)).toBe(true);
});

test("getVisitCount and increaseVisitCount Work?", () => {
  expect(controller.getVisitCount(id)).toBe(0);
  controller.increaseVisitCount(id);
  expect(controller.getVisitCount(id)).toBe(1);
});

test("deleteUrl Work?", () => {
  controller.delete(id);
  expect(controller.isExist(id)).toBe(false);
});
