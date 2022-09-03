
function generateData(name) {

    const d = new Date();
	const args_map = {
		"Integer": "int",
		"Int Column": "int",
		"Float Column": "float",
		"Float": "float",
	}

	let data = {
		"function_id": $("#analysisid").val(),
		"name" : name,
		"output_type" : "",
		"color": "",
		"args": [],
		"expressions": [],
		"metadata": {
			"user": $("#user").val(),
			"function-date": ('0'+d.getDate()).slice(-2) + "-" + ('0'+(d.getMonth()+1)).slice(-2) + "-" + d.getFullYear(),
			"function-time": ('0'+d.getHours()).slice(-2) + ":" + ('0'+d.getMinutes()).slice(-2) + ":" + ('0'+d.getSeconds()).slice(-2) + ":" + d.getMilliseconds()
		},
		"nodes": [],
		"connections": []
	}

	// Get nodes -------------------
	for (l in diagram) {
		data.nodes.push(diagram[l]);
	}
	// Get connections ----------------------
	for (k in linesArray) {
		data.connections.push(linesArray[k]);
	}

	// Loop through nodes array -----------
	// ------------------------------------
	let arg_count = 0;
	data["nodes"].forEach((node,index) => {

		// Expressions template
		let expression = {
			"id":node._id,
			"step":parseInt(index)+1,
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

			// Update expression object --------------
			expression.info.kind = "arg";
			expression.info.type = args_map[node.property];
			expression.info.name = "";
			expression.info.arg_id = arg_count;
		} else {

			// Update expression object --------------
			expression.info.kind = "operation";
			expression.info.name = node["property"].replace(/\s+/g, '_').toLowerCase();
			expression.info.color = node["color"];
		}

		// Calculate the next / from properties of every node
		// by looping through all existing connections and 
		// comparing node id's.
		if (expression.step === 1 || node.type === "Variable") expression.from = 0;

		if (node.type === "Function" || node.type === "Feature-Function") expression.from = [];
		
		data["connections"].forEach((line) => {
			if (line.to === expression.id) {
				for (l in data.expressions) {
					if (data.expressions[l].id === line.from) {
						data.expressions[l].next = expression.step;
						if (node.type === "Function" || node.type === "Feature-Function") {
							if (line.to_type === "Left") {
								expression.from[0] = data.expressions[l].step;
							} else {
								expression.from[1] = data.expressions[l].step;
							}
						} else expression.from = data.expressions[l].step;
					}
				}
			}
		});

		if (expression.info.kind === "operation") {
			expression.info.output = determineOutput(expression,data);
		}

		data.expressions.push(expression);
	})

	// Find the last node and set the next property to 0
	data.expressions.forEach((expression) => {
		if (expression.next === undefined) {
			expression.next = 0
			data.output_type = expression.info.output;
			data.color = expression.info.color;
		};
	})

	console.log(data);

    return data;
}