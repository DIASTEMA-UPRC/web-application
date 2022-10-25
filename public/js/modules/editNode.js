
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

        // Add selected class (blue border) to selected node
        $('.ui-draggable').each(function(i, obj) {
            if (obj.id == elemid) {
                $("#"+elemid).addClass( 'selected-node');
            } else {
                $(obj).removeClass('selected-node');
            }
        });

        });
    } catch(err) {
        console.log(err);
    }

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