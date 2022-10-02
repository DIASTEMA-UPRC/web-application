window.args_map = {
	"Integer": "int",
	"Integer Column": "int-column",
	"Float Column": "float-column",
	"Float": "float",
}

function generateData(name) {

    const d = new Date();

	let data = {
		"function_id": $("#analysisid").val(),
		"name" : name,
		"output_type" : "",
		"color": "",
		"args": [],
		"expression": [],
		"metadata": {
			"user": $("#user").val(),
			"function-type": "simple",
			"function-date": ('0'+d.getDate()).slice(-2) + "-" + ('0'+(d.getMonth()+1)).slice(-2) + "-" + d.getFullYear(),
			"function-time": ('0'+d.getHours()).slice(-2) + ":" + ('0'+d.getMinutes()).slice(-2) + ":" + ('0'+d.getSeconds()).slice(-2) + ":" + d.getMilliseconds()
		},
		"nodes": [],
		"connections": []
	}

	// Get nodes -------------------
	for (l in diagram) {
		data.nodes.push(diagram[l]);
		data.nodes[l].index = parseInt(l) + 1;
	}
	// Get connections ----------------------
	for (k in linesArray) {
		data.connections.push(linesArray[k]);
	}

	// Loop through nodes array -----------
	// ------------------------------------
	let arg_count = 0;
	data["nodes"].forEach((node) => {

		// Expressions template
		let expression = {
			"id":node._id,
			"step":node.index,
			"info": {}
		};

		// Args setup ------------------------
		if (args_map[node.property] != undefined) {
			arg_count++;
			
			var arg = {
				"type": args_map[node.property],
				"name": "",
				"arg_id":arg_count
			}

			data.args.push(arg);

			// linesArray.forEach((line) => {
			// 	if (line.from == node._id && line.to_type == "Left") {
			// 		data.args[0] = arg;	
			// 	} else if (line.from == node._id && line.to_type == "Right") {
			// 		data.args[1] = arg;	
			// 	} else if (line.from == node._id && line.to_type.includes(arg.type)) {
			// 		let index = line.to_type.split(" ")[0];
			// 		data.args[index] = arg;
			// 	}
			// });

			// it is a variable node
			expression.info.kind = "arg";
			expression.info.type = args_map[node.property];
			expression.info.name = "";
			expression.info.arg_id = arg_count;
		} else {

			// It is a saved function node
			if (node.type === "Saved-Function") {
				expression.info.kind = "function";
				expression.info.name = node["property"];
				expression.info.color = node["color"];
				expression.info.output = node["outputtype"];
			// it is an operation node
			} else {
				expression.info.kind = "operation";
				expression.info.name = node["property"].replace(/\s+/g, '_').toLowerCase();
				expression.info.color = node["color"];
			}
		}

		// Calculate the next / from properties of every node
		// by looping through all existing connections and 
		// comparing node id's.
		if (expression.step === 1 || node.type === "Variable") expression.from = 0;

		if (node.type === "Function" || node.type === "Saved-Function") expression.from = [];

		data["connections"].forEach((line) => {
			if (line.to === expression.id) {
				for (l in data.nodes) {
					if (data.nodes[l]._id === line.from) {
						//data.expressions[l].next = expression.step;
						if (node.type === "Function") {
							if (line.to_type === "Left") {
								expression.from[0] = data.nodes[l].index;
							} else {
								expression.from[1] = data.nodes[l].index;
							}
						} else if (node.type === "Saved-Function") {

							let pos = parseInt(line.to_type.split(" ")[0]);
							expression.from[pos-1] = data.nodes[l].index;

							data.metadata["function-type"] = "complex"
						} 
						else expression.from = data.nodes[l].index;
					}
				}
			} else if (line.from === expression.id) {
				for (l in data.nodes) {
					if (data.nodes[l]._id === line.to) {
						expression.next = data.nodes[l].index;
					}
				}
			}
		});

		// Determine output type
		if (expression.info.kind === "operation") {
			expression.info.output = determineOutput(expression,data);
		}

		data.expression.push(expression);
	})

	// Find the last node and set the next property to 0
	data.expression.forEach((expression) => {
		if (expression.next === undefined) {
			expression.next = 0
			data.output_type = expression.info.output;
			data.color = expression.info.color;
		};
	})

	console.log(data);

    return data;
}