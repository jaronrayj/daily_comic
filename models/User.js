const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: {
        type: String,
        required: true
    },

    selection: {
        type: Array,
        requied: true
    }
});

const User = mongoose.model("User", UserSchema);

module.exports = User;