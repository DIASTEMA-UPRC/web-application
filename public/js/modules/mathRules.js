function determineOutput(node,data) {

    let name = node.info.name;
	let temp_left = node.from[0];
	let temp_right = node.from[1];
	let left ="";
	let right = "";

	data.expressions.forEach((expression) => {
		if (expression.step === temp_left) {
			left = expression.info.type;
		}
		if (expression.step === temp_right) {
			right = expression.info.type;
		}
	})

    let type = "";

    if (name === "addition") {
        if (left === "int" && right === "int") {
            type = "int";
        } else {
            type = "float";
        }
    } else if (name === "subtraction") {
        if (left === "int" && right === "int") {
            type = "int";
        } else {
            type = "float";
        }
    } else if (name === "multiplication") {	
        if (left === "int" && right === "int") {
            type = "int";
        } else {
            type = "float";
        }
    } else if (name === "division") {
        type = "float";
    } else if (name === "power") {
        type = "float";
    } else if (name === "logarithm") {
        type = "float";
    } else if (name === "exponential") {
        type = "float";
    }else if (name === "greater_than") {
        type = "bool";
    } else if (name === "less_than") {
        type = "bool";
    } else if (name === "equal") {
        type = "bool";
    } else if (name === "not_equal") {
        type = "bool";
    } else if (name === "greater_or_equal") {
        type = "bool";
    } else if (name === "less_or_equal") {
        type = "bool";
    } else if (name === "logical_and") {
        type = "bool";
    } else if (name === "logical_or") {
        type = "bool";
    } else if (name === "logical_not") {
        type = "bool";
    } else if (name === "mean_value") {
        type = "float";
    } else if (name === "amount_of") {
        type = "int";
    } else if (name === "variance_value") {
        type = "float";
    }

    return type;
}

function checkTheMath(node_end) {

    let color = node_end.color
				
    // blue
    if (color === "#535ed1") {
        for (const l in diagram) {
            if (diagram[l]._id == start_id) {
                let color2 = diagram[l].color

                if (color2 === "#535ed1") {
                    toastr.error("Input type cannot be: BOOLEAN for this function", "Notification:");
                    
                    return false;
                } else return true;
            }
        }

    // red or yellow
    } else if (color === "#a53434" || color === "#eeb63e") {
        for (const l in diagram) {
            if (diagram[l]._id == start_id) {
                let color2 = diagram[l].color

                if (color2 === "#535ed1" || color2 === "#5f8b4d") {
                    toastr.error("Input type cannot be: BOOLEAN for this function", "Notification:");
                    
                    return false;
                } else return true;
            }
        }
    }

    // green
    else if (color === "#5f8b4d") {
        for (const l in diagram) {
            if (diagram[l]._id == start_id) {
                let color2 = diagram[l].color

                if (color2 === "#a53434" || color2 === "#eeb63e") {
                    toastr.error("Input type cannot be: NUMERIC for this function", "Notification:");
                    
                    return false;
                } else return true;
            }
        }
    }
}