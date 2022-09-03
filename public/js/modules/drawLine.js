let count = 0;
let start_id = 0
let end_id = 0;
let dots = [];

function drawLine (item) {
    count++;
	console.log("Dots", dots);
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
		dots.push(dot);
		for (o in diagram) {
			if (diagram[o]._id == id) {
				// start = document.getElementById(diagram[o]._id);
				start_id = diagram[o]._id;
			}
		}
		
	// Set end node
	} else if (count == 2) {

		dots.push(dot);
		
		for (o in diagram) {
			if (diagram[o]._id == id) {
				end_id = diagram[o]._id;
			}
		}

		// Check if the same node was clicked twice
		if (start_id === end_id) {
			count = 0;
			dots= [];
			return;
		}

		// Check for math logic
		for (const i in diagram) {
			if (diagram[i]._id == end_id) {

				if (checkTheMath(diagram[i],dots,count) === false) {
					dots = [];
                    count = 0;
					return;
				}
			}
		}

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
				}
			}
		});

		count = 0;
	}
}