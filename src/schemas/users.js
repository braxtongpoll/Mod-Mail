const mongoose = require('mongoose');
const schema = new mongoose.Schema({
    _id: String,
    active: { type: String, default: "" }
});
module.exports = mongoose.model(`users`, schema);