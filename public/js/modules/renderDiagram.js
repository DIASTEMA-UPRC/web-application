
function renderDiagram() {

    canvas.empty();

    diagram.forEach(node => {

        let html = generateHTML(node);

        let dom = $(html).css({
            "position":"absolute",
            "top": node.position.top,
            "left": node.position.left
        }).draggable({
            containment: '.canvas',
            stop:function (event,ui){

                let id = ui.helper.attr("id");

                for (let node of diagram) {
                    if (node._id == id) {
                        node.position.top = ui.position.top;
                        node.position.left = ui.position.left;
                    }
                }
                for (const line of linesArray) {
                    line.position();
                }
            },
            drag: function(event,ui) {
                for (const line of linesArray) {
                    line.position();
                }
            }
        }).attr("id",node._id);
        canvas.append(dom);
    });

    reDraw();
}