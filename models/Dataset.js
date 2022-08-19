const mongoose = require("mongoose");

const datasetSchema = new mongoose.Schema ({
    label: String,
    ingestationId: String,
    ingestionDateTime: String,
    organization: String,
    user: String,
    method: String,
    link: String,
    token: String,
});

module.exports = mongoose.model("Dataset", datasetSchema, "datasets");