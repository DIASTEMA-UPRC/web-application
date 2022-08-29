const mongoose = require("mongoose");

const datasetSchema = new mongoose.Schema ({
    label: String,
    ingestationId: String,
    ingestionDateTime: String,
    organization: String,
    user: String,
    requestData: Object
});

module.exports = mongoose.model("Dataset", datasetSchema, "datasets");