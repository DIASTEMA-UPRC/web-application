const mongoose = require("mongoose");

const graphSchema = new mongoose.Schema ({
    user: String,
    name: String,
    analysisid: String,
    datetime: String,
    jobs: Object,
    nodes: Object,
    connections: Object
});

module.exports = mongoose.model("Graph", graphSchema, "pipelines");