const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ComicSchema = new Schema ({
    comic: {
        type:   String,
        required: true
    },

    img: {
        type: String,
        requied: true
    },

    date: {
        type: String,
        required: true
    },
    note: {
        type: Schema.Types.ObjectId,
        ref: "Note"
    }
});

const Comic = mongoose.model("Comic", ComicSchema);

module.exports = Comic;