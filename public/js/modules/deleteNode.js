function deleteNode(elemid) {

	// Find position of selected node in diagram array
	for (s in diagram) {
		if (diagram[s]._id == elemid) {
			var pos = s;
		}
	}

	for (j in linesArray) {
		if (linesArray[j].from == elemid || linesArray[j].to == elemid) {
			tobedeleted.push(linesArray[j]);
			linepos.push(parseInt(j));
		}
	}
	for (g in tobedeleted) {
		for (f in linesArray) {
			if (tobedeleted[g]._id == linesArray[f]._id) {
				linesArray.splice(f,1);
			}
		}
		tobedeleted[g].remove();
	}
	tobedeleted = [];
	linepos = [];

	if (pos != undefined) {
		diagram.splice(pos,1);
		renderDiagram(diagram);
	}
}