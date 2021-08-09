require("dotenv").config();
const db = require("./db/connection");
const server = require("./server/server");

(async () => {
  try {
    if (process.env.dbAuthenticate) {
      await db.authenticate();
    }
    if (process.env.dbSync) {
      await db.sync({ force: process.env.dbSyncForce });
    }
    server.start();
  } catch (err) {
    console.log(err.message);
    throw new Error("Cannot Connect to db!");
  }
})();
