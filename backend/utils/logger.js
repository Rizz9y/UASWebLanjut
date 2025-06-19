const Log = require("../models/Log");

async function saveLog({ level = "info", message, meta = {}, user = null }) {
  try {
    await Log.create({ level, message, meta, user });
  } catch (error) {
    console.error("Gagal menyimpan log ke MongoDB:", error);
  }
}

module.exports = { saveLog };