let count = 0;
let start_id = 0
let end_id = 0;
let dots = [];

function drawLine (item) {
    count++;

	// Set up a parent array
	var parents = [];

	// Push each parent element to the array
	for ( ; item && item !== document; item = item.parentNode ) {
		parents.push(item);
	}

	let id = parents[6].id
	let dot = parents[0];

	// Set start node
	if (count == 1) {
		console.log("Start node: " + parents[5].firstElementChild.innerText);
		dots.push(dot);
		for (o in diagram) {
			if (diagram[o]._id == id) {
				start_id = diagram[o]._id;
			}
		}
		
	// Set end node
	} else if (count == 2) {

		console.log("End node: " + parents[5].firstElementChild.innerText);
		dots.push(dot);
		
		for (o in diagram) {
			if (diagram[o]._id == id) {
				end_id = diagram[o]._id;
			}
		}

		// LINE CHECKS -----------------------------
		// -----------------------------------------
		const dot1 = dots[0].previousElementSibling.innerHTML
		const dot2 = dots[1].previousElementSibling.innerHTML

		// If Output is clicked twice, then dont clear the dots
		// Instead count just the first click as start node
		if ((start_id === end_id) && (dot1 === "Output" && dot2 === "Output")) {
			count = 1;
			dots.pop();
			return;
		} else if ((start_id === end_id) && (dot1 === "int" && dot2 === "int")) {
			count = 1;
			dots.pop();
			return;
		} else if ((start_id === end_id) && (dot1 === "float" && dot2 === "float")) {
			count = 1;
			dots.pop();
			return;
		}
		// Check if the same node was clicked twice 
		else if (start_id === end_id) {
			count = 0;
			dots= [];
			return;
		}

		// Connect from left to right
		if ((dot1 === "Left" || dot1 === "Right") && dot2 === "Output") {
			toastr.error("Please connect from left to right.", "Notification:");
			count = 0;
			dots= [];
			return;
		}

		// Check for output - output connection
		if ( (dot1 === "Output" && dot2 === "Output") || dot2 === "Output" ) {
			console.log("Output - Output connection");
			toastr.error("Invalid connection.", "Notification:");
			count = 0;
			dots= [];
			return;
		}

		// Check for left - left / right - right / left - right / right - left connection
		if ((dot1 === "Left" || dot1 === "Right") && (dot2 === "Left" || dot2 === "Right")) {
			toastr.error("Invalid connection.", "Notification:");
			count = 0;
			dots= [];
			return;
		}

		// Check for graph splitting
		for (i in linesArray) {
			if (linesArray[i].from == start_id) {
				toastr.error("Nodes can only have one output.", "Notification:");
				count = 0;
				dots= [];
				return;
			}
		}

		// Check for math logic
		for (const i in diagram) {
			if (diagram[i]._id == end_id) {

				if (checkTheMath(diagram[i],dots) === false) {
					dots = [];
                    count = 0;
					return;
				}
			}
		}

		// END LINE CHECKS -----------------------------
		// ---------------------------------------------

		// Finally, draw the line
		var line = new LeaderLine(
			LeaderLine.pointAnchor(dots[0]),
			LeaderLine.pointAnchor(dots[1]),
			{
				startPlug: 'disc',
				endPlug: 'disc',
				startPlugColor: '#3a91b3',
				endPlugColor:'#3a91b3',
				startPlugSize: 0.7,
				endPlugSize: 0.7,
				color:'#3a91b3',
				startSocket:'right',
				endSocket:'left',
				size: 5
			}
		);

		line["from"] = start_id;
		line["to"] = end_id;
		line["to_type"] = dot.previousElementSibling.innerHTML;
		line["id"] = (new Date).getTime();

		linesArray.push(line);
		dots = [];

		// Update nodes for connections
		diagram.forEach(node => {
			if (node._id == start_id) {
				node["line_output"] = line.id;
			} else if (node._id == end_id) {
				if (line["to_type"] === "Left") {
					node["line_left_input"] = line.id;
				} else if (line["to_type"] === "Right") {
					node["line_right_input"] = line.id;
				} else {
					node.lines[parseInt(line["to_type"].split(" ")[0]) - 1] = line.id;
				}
			}
		});

		count = 0;
	}
}