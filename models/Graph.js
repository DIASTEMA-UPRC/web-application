const mongoose = require("mongoose");

const graphSchema = new mongoose.Schema ({
    analysisid: String,
    name: String,
    databaseid: String,
    jobs: Object,
    metadata: Object,
    nodes: Object,
    connections: Object
});

module.exports = mongoose.model("Graph", graphSchema, "pipelines");