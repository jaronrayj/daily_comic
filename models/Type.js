const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const TypeSchema = new Schema ({
    title: {
        type:   String,
        required: true
    },

    link: {
        type: String,
        requied: true
    }
});

const Type = mongoose.model("Type", TypeSchema);

module.exports = Type;