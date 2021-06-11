const mongoose = require('mongoose');
const schema = new mongoose.Schema({
    _id: String,
    blockedUsers: { type: Array, default: [] },
    category: { type: String, default: "" },
    closedMailLogs: { type: String, default: "" },
    activeMail: { type: Object, default: {} },
    roles: { type: Array, default: [] },
});
module.exports = mongoose.model(`datas`, schema);