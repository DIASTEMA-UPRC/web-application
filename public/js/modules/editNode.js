
var linepos = [];

function editNode(element) {

    // Set up a parent array
    let parents = [];
    // Push each parent element to the array
    for ( ; element && element !== document; element = element.parentNode ) {
        parents.push(element);
    }
    
    let elemid = parents[0].id;
    
    // Save node position
    for (s in diagram) {
        if (diagram[s]._id == elemid) {
            var pos = s;
        }
    }

    // Click on title to show delete
    try {
        $("#"+elemid).click(function(event){
            event.stopPropagation();
            $("#delete_node").show();
        });
    } catch(err) {
        console.log(err);
    }

    // Click button to delete node and re-render diagram
    window.deleteNode = function () {
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

        diagram.splice(pos,1);
        renderDiagram();
    };

    // Change property of node object
    window.changeProperty = function (node) {
        if (node.value == "Cleaning") {
            // Set up a parent array
            let parents = [];
            let element = node;
            // Push each parent element to the array
            for ( ; element && element !== document; element = element.parentNode ) {
                parents.push(element);
            }
            $("#"+parents[3].id+" label").hide();
            $("#"+parents[3].id+" input").hide();
        }
        diagram[pos].property = node.value;
    }
}