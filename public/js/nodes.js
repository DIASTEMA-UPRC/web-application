
function generatePipelineHTML(node,dataset) {
    let nodeDOM = 
    `<div onclick="editNode(this)">
        <div id="tool" class="flowchart-default-operator draggable_operator flowchart-operator" 
            data-nb-inputs="${node.inputs}" 
            data-nb-outputs="${node.outputs}"
            style="border: 4px solid ${node.color};"
        >
            <div class="flowchart-operator-title ui-draggable-handle" style="border-bottom: 2px solid ${node.color};background: ${node.color};">`
                if (node.type === "Saved Function") {
                    nodeDOM += `${node.property}`;
                } else {
                    nodeDOM += `${node.type}`;
                }
            nodeDOM += 
            `</div>
            <div class="flowchart-operator-inputs-outputs">
                <div class="flowchart-operator-inputs">
                    <div class="flowchart-operator-connector-set">`

            // Find if there is at least one column input in the node
            if (node.inptypes) {
                var count = node.inptypes.filter((v) => v.includes("column")).length
                if (count > 0) var flag=true
            }
            // Node Inputs
            for (let i = 0; i < node.inputs; i++) {

                if (node.type == "Saved Function") {

                    // if node input is a column
                    if (node.inptypes[i].includes("column")) {                        
                        nodeDOM += `
                        <div class="flowchart-operator-connector">
                            <div class="flowchart-operator-connector-label">${i+1} (${node.inptypes[i]})</div>
                            <div class="flowchart-operator-connector-arrow" onclick="drawLine(this)"></div>
                            <input 
                                type="text" id="${i}" 
                                name="func_input_col" 
                                class="form-control column" 
                                style="margin:auto auto 15px 
                                auto;width:80%;height:70%" 
                                onclick="editColumn(this)" 
                                value="${node.field[i]}"
                                placeholder="${node.inpnames[i]}"
                            >
                            </input>
                            <div class="flowchart-operator-connector-small-arrow"></div> 
                        </div>
                        `
                    // else if it is a variable
                    } else {
                        nodeDOM += `
                        <div class="flowchart-operator-connector">
                            <div class="flowchart-operator-connector-label">${i+1} (${node.inptypes[i]})</div>`
                            
                            if (i == 0) {
                                if (!flag) {
                                    nodeDOM += `<div class="flowchart-operator-connector-arrow" onclick="drawLine(this)"></div>`
                                }
                            }

                            nodeDOM += `
                            <input 
                                type="text" id="${i}" 
                                name="func_input_num" 
                                class="form-control column" 
                                style="margin:auto auto 15px auto;width:80%;height:70%" 
                                onclick="editColumn(this)" 
                                value="${node.field[i]}"
                                placeholder="${node.inpnames[i]}"
                            >
                            </input>
                            <div class="flowchart-operator-connector-small-arrow"></div>
                        </div>
                        `
                    }
                } else {
                nodeDOM += `
                        <div class="flowchart-operator-connector">
                            <div class="flowchart-operator-connector-label">Input</div>
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

            // Node Outputs
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
            </div>`
            // Node content
            switch(node.type) {
                case "Data Ingestion":
                    nodeDOM += `<label for="field" style="margin-bottom:-3px;">Dataset Name:</label>
                                <input type="text" name="field" class="form-control column" style="margin:auto auto 15px auto;width:80%;height:70%" onclick="editColumn(this)" value="${node.field}"></input>
                                
                                <label for="link" style="margin-bottom:-3px;">Dataset Link:</label>
                                <input type="text" name="link" class="form-control column" style="margin:auto auto 15px auto;width:80%;height:70%" onclick="editColumn(this)" value="${node.link}"></input>
                                
                                <label for="token" style="margin-bottom:-3px;">Token:</label>
                                <input type="text" name="token" class="form-control column" style="margin:auto auto 15px auto;width:80%;height:70%" onclick="editColumn(this)" value="${node.token}"></input>
                                `
                    break;
                case "Join Datasets":
                    nodeDOM += `<select name="nodeProperty" id="nodeProperty" onchange="changeProperty(this)" style="margin:5px auto 10px auto;">
                                    <option selected="true" disabled="disabled" value="default">${node.property}</option>
                                    <option value="Inner">Inner</option>
                                    <option value="Left">Left</option>
                                    <option value="Right">Right</option>
                                    <option value="Outer">Outer</option>
                                </select>
                                
                                <label for="field" style="margin-bottom:-3px;">Use column:</label>
                                <input type="text" name="field" class="form-control column" style="margin:auto auto 15px auto;width:80%;height:70%" onclick="editColumn(this)" value="${node.field}"></input>
                                `
                    break;
                case "Classification":
                    nodeDOM += `<select name="nodeProperty" id="nodeProperty" onchange="changeProperty(this)" style="margin:5px auto 10px auto;">
                                    <option selected="true" disabled="disabled" value="default">${node.property}</option>
                                    <option value="Logistic regression">Logistic regression</option>
                                    <option value="Decision tree classifier">Decision tree classifier</option>
                                    <option value="Random forest classifier">Random forest classifier</option>
                                    <option value="Gradient-boosted tree classifier">Gradient-boosted tree classifier</option>
                                    <option value="Multilayer perceptron classifier">Multilayer perceptron classifier</option>
                                    <option value="Linear Support Vector Machine">Linear Support Vector Machine</option>
                                </select>
                                
                                <label for="field" style="margin-bottom:-3px;">Use column:</label>
                                <input type="text" name="field" class="form-control column" style="margin:auto auto 15px auto;width:80%;height:70%" onclick="editColumn(this)" value="${node.field}"></input>
                                `
                    break;
                case "Regression":
                    nodeDOM += `<select name="nodeProperty" id="nodeProperty" onchange="changeProperty(this)" style="margin:5px auto 10px auto;">
                                    <option selected="true" disabled="disabled" value="default">${node.property}</option>
                                    <option value="Linear regression">Linear regression</option>
                                    <option value="Generalized linear regression">Generalized linear regression</option>
                                    <option value="Decision tree regression">Decision tree regression</option>
                                    <option value="Random forest regression">Random forest regression</option>
                                    <option value="Gradient-boosted tree regression">Gradient-boosted tree regression</option>
                                </select>
                                
                                <label for="field" style="margin-bottom:-3px;">Use column:</label>
                                <input type="text" name="field" class="form-control column" style="margin:auto auto 15px auto;width:80%;height:70%" onclick="editColumn(this)" value="${node.field}"></input>
                                `
                    break;
                case "Cleaning":
                    nodeDOM += `<label for="field" style="margin-bottom:-3px;">Max Shrink:</label>
                                <input type="text" inputmode="numeric" name="field" class="form-control column" style="margin:auto auto 15px auto;width:80%;height:70%" onclick="editColumn(this)" value="${node.field}"></input>
                                `
                    break;
                case "Dataset":
                    nodeDOM += `<select name="nodeProperty" id="datasetProperty" onchange="changeProperty(this)" style="margin:5px auto 10px auto;width:90%">
                                    <option selected="true" disabled="disabled" value="${node.property}">${node.property}</option>`

                                    for (let i = 0; i < dataset.length; i++) {
                                        nodeDOM += `<option value="${dataset[i].label}">${dataset[i].label}</option>`
                                    }
                    nodeDOM += `
                                </select>
                                `

                    break;
                case "Integer":
                    nodeDOM += `<label for="field" style="margin-bottom:-3px;">Value:</label>
                                <input type="number" step="1" pattern="^[-/d]/d*$" name="field" class="form-control column" style="margin:auto auto 15px auto;width:80%;height:70%" onclick="editColumn(this)" value="${node.field}"></input>
                                `
                    break;
                case "Float":
                nodeDOM += `<label for="field" style="margin-bottom:-3px;">Value:</label>
                            <input type="number" step="1" pattern="^[-/d]/d*$" name="field" class="form-control column" style="margin:auto auto 15px auto;width:80%;height:70%" onclick="editColumn(this)" value="${node.field}"></input>
                            `
                break;
                default:
                    break;
            }

        nodeDOM += `
        </div>
    </div>`;

    return nodeDOM;
}