function determineOutput(node,data) {

    let name = node.info.name;
	let temp_left = node.from[0];
	let temp_right = node.from[1];
	let left ="";
	let right = "";

	data.nodes.forEach((temp_node) => {
		if (temp_node.index === temp_left) {
			left = args_map[temp_node.property];
		}
		if (temp_node.index === temp_right) {
			right = args_map[temp_node.property];
		}
	})

    let type = "";

    if (name === "addition") {
        if ((left === "int" && right === "int-column") || (left === "int-column" && right === "int") || (left === "int" && right ==="int")) {
            type = "int";
        } else {
            type = "float";
        }
    } else if (name === "subtraction") {
        if ((left === "int" && right === "int-column") || (left === "int-column" && right === "int") || (left === "int" && right ==="int")) {
            type = "int";
        } else {
            type = "float";
        }
    } else if (name === "multiplication") {	
        if ((left === "int" && right === "int-column") || (left === "int-column" && right === "int") || (left === "int" && right ==="int")) {
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

function checkTheMath(node_end,dots) {

    let color = node_end.color

    if (node_end.type == "Feature-Function") {

        let start_index = diagram.findIndex(obj => obj._id == start_id)

        if (diagram[start_index].property == "Integer" || diagram[start_index].property == "Float") {
            toastr.error("Input can only be Numeric COLUMN for this function", "Notification:"); 
            return false;
        }
    } else if (node_end.type == "Saved-Function") {
        let start_index = diagram.findIndex(obj => obj._id == start_id)

        console.log(diagram[start_index].outputtype);
        
        // if the start node is a saved function
        if (diagram[start_index].type === "Saved-Function") {
            if (!dots[1].previousElementSibling.innerHTML.includes(diagram[start_index].outputtype)) {
                toastr.error("This variable is not accepted as input", "Notification:"); 
                return false;    
            }
            if (dots[1].previousElementSibling.innerHTML.includes("column") && !diagram[start_index].outputtype.includes("column")) {
                toastr.error("This variable is not accepted as input", "Notification:"); 
                return false;    
            }
        // if the start node is a variable
        } else {
            // check if the translated type is included in the element dot text
            if (!dots[1].previousElementSibling.innerHTML.includes(args_map[diagram[start_index].property])) {

                toastr.error("This variable is not accepted as input", "Notification:"); 
                return false;
            }
        }

    } else {
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

                    if (color2 === "#a53434" || color2 === "#eeb63e" || color2 === "#181818") {
                        toastr.error("Input type cannot be: NUMERIC for this function", "Notification:");
                        
                        return false;
                    } else return true;
                }
            }
        }
    }
				
    
}