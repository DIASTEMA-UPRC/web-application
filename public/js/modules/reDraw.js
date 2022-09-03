
function reDraw() {
    
    for (var d in diagram) {

        // Redraw each connected line
        let templines = [];

        linesArray.forEach((line,index) => {

            let fromid = line.from;
            let toid = line.to;
            let to_type = line.to_type;

            let elemfrom = document.getElementById(fromid);
            let elemto = document.getElementById(toid);

            let fromchildren = $(elemfrom).find('*');
            let tochildren = $(elemto).find('*');

            // Find out if the line starts from a function or a variable
            if (fromchildren[0].classList.contains("flowchart-operator-function")) {
                var nodefrom = fromchildren[17];
            } else {
                var nodefrom = fromchildren[9];
            }
            
            // Find out if the line ends in a Left or Right dot
            if (to_type === "Left") {
                var nodeto = tochildren[7];
            } else if (to_type === "Right"){
                var nodeto = tochildren[11];
            }

            line.remove();
            linesArray.splice(index,1);

            let newLine = new LeaderLine(
                LeaderLine.pointAnchor(nodefrom),
                LeaderLine.pointAnchor(nodeto),
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

            newLine["from"] = fromid;
            newLine["to"] = toid;
            newLine["to_type"] = to_type;

            templines.push(newLine);
        });

        linesArray = linesArray.concat(templines);
    }
}