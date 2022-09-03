
function generateHTML(node) {

    let nodeDOM = 
    `<div onclick="editNode(this)">
        <div id="tool" class="flowchart-default-operator draggable_operator ${node.inputs == 0 ? "flowchart-operator-variable" : "flowchart-operator-function"}"
            data-nb-inputs="${node.inputs}" 
            data-nb-outputs="${node.outputs}"
            style="border: 4px solid ${node.color};"
        >
            <div class="flowchart-operator-title ui-draggable-handle" style="border-bottom: 2px solid ${node.color};background: ${node.color};">
                ${node.property}
            </div>
            <div class="flowchart-operator-inputs-outputs">
                <div class="flowchart-operator-inputs">
                    <div class="flowchart-operator-connector-set">`;
            
            // Inputs
            for (let i = 0; i < node.inputs; i++) {
                nodeDOM += `
                        <div class="flowchart-operator-connector">
                            <div class="flowchart-operator-connector-label">${i==0 ? "Left" : "Right"}</div>
                            <div class="flowchart-operator-connector-arrow" onclick="drawLine(this)"></div>
                            <div class="flowchart-operator-connector-small-arrow"></div>
                        </div>`;
            }

            nodeDOM += `
                    </div>
                </div>
                <div class="flowchart-operator-outputs">
                    <div class="flowchart-operator-connector-set">`;

            // Outputs
            for (let i = 0; i < node.outputs; i++) {
                nodeDOM += `
                        <div class="flowchart-operator-connector">
                            <div class="flowchart-operator-connector-label">Output</div>
                            <div class="flowchart-operator-connector-arrow" onclick="drawLine(this)"></div>
                            <div class="flowchart-operator-connector-small-arrow"></div>
                        </div>`;
            }

            nodeDOM += `
                    </div>
                </div>
            </div>
        </div>
    </div>`;

    return nodeDOM;
}

