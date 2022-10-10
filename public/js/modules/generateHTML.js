
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
                if (node.type == "Saved-Function") {
                    nodeDOM += `
                    <div class="flowchart-operator-connector">
                        <div class="flowchart-operator-connector-label">${i+1} (${node.inptypes[i]})</div>
                        <div class="flowchart-operator-connector-arrow" onclick="drawLine(this)"></div>
                        <div class="flowchart-operator-connector-small-arrow"></div>
                    </div>`;    
                } else {
                nodeDOM += `
                        <div class="flowchart-operator-connector">
                            <div class="flowchart-operator-connector-label">${i==0 ? "Left" : "Right"}</div>
                            <div class="flowchart-operator-connector-arrow" onclick="drawLine(this)"></div>
                            <div class="flowchart-operator-connector-small-arrow"></div>
                        </div>`;
                }
            }

            nodeDOM += `
                    </div>
                </div>
                <div class="flowchart-operator-outputs">
                    <div class="flowchart-operator-connector-set">`;

            // Outputs
            for (let i = 0; i < node.outputs; i++) {
                if (node.type == "Saved-Function") {
                    nodeDOM += `
                        <div class="flowchart-operator-connector">
                            <div class="flowchart-operator-connector-label">${node.outputtype}</div>
                            <div class="flowchart-operator-connector-arrow" onclick="drawLine(this)"></div>
                            <div class="flowchart-operator-connector-small-arrow"></div>
                        </div>`;
                } else {
                nodeDOM += `
                        <div class="flowchart-operator-connector">
                            <div class="flowchart-operator-connector-label">Output</div>
                            <div class="flowchart-operator-connector-arrow" onclick="drawLine(this)"></div>
                            <div class="flowchart-operator-connector-small-arrow"></div>
                        </div>`;
                }
            }

            nodeDOM += `
                    </div>
                </div>
            </div>`

            if (node.type === "Variable") {
                
                nodeDOM += `
                <input 
                    type="text" 
                    name="field" 
                    class="form-control column" 
                    style="margin:auto;margin-bottom:15px;width:80%;height:70%"
                    placeholder="Variable Name"
                    onclick="editColumn(this)" 
                    value="${node.field}">
                </input>`;

            }
        
        nodeDOM += `
        </div>
    </div>`;

    return nodeDOM;
}

