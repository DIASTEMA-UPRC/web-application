function validateFields() {
	let outcome = true;
	if (diagram.length === 0) {
		toastr.error("Please add at least one node to the diagram.", "Notification:");
		outcome = false;
	} else {
		for (m in diagram) {

			// Variable Node validation
			if (diagram[m].type === "Variable") {
				if (diagram[m].field === "") {
					toastr.error("Please fill all the required fields.", "Notification:");
					outcome = false;
				}
			}
		}
	}
	
	return outcome;
}