"Use Strict";

const Log = require("../models/Log"),
  saveLog = (userRole, userId, action, msg) => {
    let log = new Log({
      userRole: userRole,
      userId: userId,
      action: action,
      msg: msg,
    });
    log.save();
  };

module.exports = { saveLog };
