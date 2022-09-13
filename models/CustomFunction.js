const mongoose = require("mongoose");

const functionSchema = new mongoose.Schema ({
    function_id: String,
    name: String,
    output_type: String,
    color:String,
    args: Object,
    expression: Object,
    metadata: Object,
    nodes: Object,
    connections: Object
});

module.exports = mongoose.model("CustomFunction", functionSchema, "functions");