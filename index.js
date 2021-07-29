require("dotenv").config();
const db = require("./db/connection");
const server = require("./server/server");

(async () => {
  try {
    await db.authenticate();
    server.start();
  } catch (err) {
    console.log(err.message);
    throw new Error("Cannot Connect to db!");
  }
})();
