const mongoose = require("mongoose");

const modelSchema = new mongoose.Schema ({
    job_id: String,
    state: String,
    metadata: Object
});

module.exports = mongoose.model("SavedModel", modelSchema, "podstates");