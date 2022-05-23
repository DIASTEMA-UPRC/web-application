const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const graphSchema = new mongoose.Schema ({
    user: String,
    name: String,
    analysisid: String,
    datetime: String,
    jobs: Object,
    nodes: Object,
    connections: Object
});

module.exports = graphSchema;