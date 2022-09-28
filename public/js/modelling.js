var diagram = [];
var linesArray = [];

$("#delete_node").hide();
$("#deploy_graph").attr("disabled", true);

// Send notification when receiving message from orchestrator //
const socket = io.connect();

toastr.options = {
	"closeButton": true,
	"debug": false,
	"newestOnTop": true,
	"progressBar": true,
	"positionClass": "toast-bottom-right",
	"preventDuplicates": false,
	"showDuration": "300",
	"hideDuration": "1000",
	"timeOut": "3000",
	"extendedTimeOut": "1500",
	"showEasing": "swing",
	"hideEasing": "linear",
	"showMethod": "fadeIn",
	"hideMethod": "fadeOut"
}

// Notifications counter
let i = 0;
let first = true;
socket.on('Modeller', (update) => {
	const date = new Date();
	i++;
	$('#alerts').html(i)

	if (first) {
		// Add to notifications list
		$('#notif_list').append(" \
		<a gtm-id='Notifications' class='dropdown-item' style='padding: 10px 30px 10px 30px;'> \
			<p class='small text-uppercase mb-2'>"+ ('0'+date.getHours()).slice(-2) + ":" + ('0'+date.getMinutes()).slice(-2) + ":" + ('0'+date.getSeconds()).slice(-2) +"</p> \
			<p style='color:#5f5f5f' class='mb-0'>Update: " + update + "</p> \
		</a> \
		");
		first = false;
	} else {
		// Add to notifications list
		$('#notif_list').append(" \
			<a gtm-id='Notifications' class='dropdown-item' style='padding: 10px 30px 10px 30px;border-top:2px solid #3a91b33f'> \
				<p class='small text-uppercase mb-2'>"+ ('0'+date.getHours()).slice(-2) + ":" + ('0'+date.getMinutes()).slice(-2) + ":" + ('0'+date.getSeconds()).slice(-2) +"</p> \
				<p style='color:#5f5f5f' class='mb-0'>Update: " + update + "</p> \
			</a> \
		");
	}

	// Send push notification
	toastr.info(update, "Notification:");
});

// Reset bell counter
$('#navbarNotification').click(() => {
	$('#alerts').empty();
	i=0;
});
// --------------------------------------------------------- //

// Display toast after save and redirect
if(sessionStorage.getItem("showmsg")=='1'){
	toastr.info("Pipeline was saved successfully.", "Notification:");
	sessionStorage.removeItem("showmsg");
}


$(document).ready(function() {

	var canvas = $(".canvas");

	$(".draggable_operator").draggable({
		helper: "clone",
		scroll: false
	});

	// actions when dropped
	canvas.droppable({
		drop:function (event,ui) {

			if (ui.helper[0].children[1] === undefined) {
				return;
			}

			let dom = ui.helper[0];

			var node = {
				_id: (new Date).getTime(),
				position: ui.helper.position(),
				property:dom.children[1].innerHTML,
				type: dom.dataset.type,
				inputs:parseInt(dom.dataset.inputs),
				outputs:parseInt(dom.dataset.outputs),
				color:dom.dataset.color
			};

			switch (node.type) {
				case "Classification":
					node.field = ''
					node.property = "Select Algorithm"
					break;
				case "Regression":
					node.field = ''
					node.property = "Select Algorithm"
					break;
				case "Cleaning":
					node.field = ''
					break;
				case "Data Ingestion":
					node.field = ''
					node.link = ''
					node.token = ''
					break;
				case "Join Datasets":
					node.field = ''
					node.property = "Select Join"
					break;
				case "Dataset":
					node.field = ''
					node.property = "Select Dataset"
					node.selectedFeature = "Select Feature"
					node.features = []
					break;
				case "Saved Function":
					node.name = dom.dataset.name;
					node.inptypes = [];
					let types = dom.dataset.inptypes.split(",");
					types.forEach((type,index)=>{
						type.split(" ").forEach((t,i)=>{
							if (t !== "") {
								if (t!=="\n") {
									node.inptypes.push(t);
								}
							}
						})
					})

					node.outputtype = dom.dataset.outputtype;
					node.field = [];
					for(var i=0; i<node.inputs ;i++){
						node.field.push('');
					}
					break;
				default:
					break;
			}

			node.position.top +=25;

			diagram.push(node);
			renderDiagram(diagram);
		}
	});

	window.renderDiagram = async function (diagram) {
		canvas.empty();
		for (var d in diagram) {
			var node = diagram[d];

			// If node is a dataset then get the ready datasets
			if (node.type === "Dataset") {
				try {
					var resp = await fetch("/datasets/ready", {
						method: "GET",
						headers: {
							'Accept': 'application/json',
							'Content-Type': 'application/json',
						}
					});
					var response = await resp.json();
				} catch (error) {
					console.log(error);
				}
			}

			let html = generatePipelineHTML(node,response);

			var dom = $(html).css({
				"position":"absolute",
				"top": node.position.top,
				"left": node.position.left
			}).draggable({
				containment: '.canvas',
				stop:function (event,ui){
					var id = ui.helper.attr("id");
					for (var i in diagram) {
						if (diagram[i]._id == id) {
							diagram[i].position.top = ui.position.top;
							diagram[i].position.left = ui.position.left;
						}
					}
					for (k in linesArray) {
						linesArray[k].position();
					}
				},
				drag: function(event,ui) {
					for (k in linesArray) {
						linesArray[k].position();
					}
				}
			}).attr("id",node._id);
			canvas.append(dom);
		}

		reDraw();

	}

	// Generate data
	async function generateData() {

		const d = new Date();

		// Main json file template ---------------------------------------
		let data = {
			"diastema-token":"diastema-key",
			"analysis-id": $("#analysisid").val(),
			"database-id": $("#org").val(),
			"jobs":[],
			"metadata":{
				"user": $("#user").val(),
				"datasets":[],
				"analysis-date": ('0'+d.getDate()).slice(-2) + "-" + ('0'+(d.getMonth()+1)).slice(-2) + "-" + d.getFullYear(),
				"analysis-time": ('0'+d.getHours()).slice(-2) + ":" + ('0'+d.getMinutes()).slice(-2) + ":" + ('0'+d.getSeconds()).slice(-2) + ":" + d.getMilliseconds()
			},
			"nodes":[],
			"connections":[]
		};

		// Get nodes -----------------------------
		for (l in diagram) {
			data.nodes.push(diagram[l]);
			data.nodes[l].index = parseInt(l) + 1;
		}
		// Get connections ----------------------
		for (k in linesArray) {
			data.connections.push(linesArray[k]);
		}

		// Loop through nodes array
		for (m in data.nodes) {

			// Job template
			let job = {
				"title":data.nodes[m].type.replace(/\s+/g, '-').toLowerCase(),
				"id":data.nodes[m]._id,
				"step":data.nodes[m].index,
				"from":'',
				"next":[],
				"save":false
			};

			// Calculate the next / from properties of every node
			// by looping through all existing connections and
			// comparing node id's.
			if (job.step === 1 || data.nodes[m].type === "Dataset") job.from = 0;
			if (data.nodes[m].type === "Join Datasets" || data.nodes[m].type === "Saved Function") job.from = [];

			data["connections"].forEach((line) => {
				if (line.to === job.id) {
					for (l in data.nodes) {
						if (data.nodes[l]._id === line.from) {

							if (data.nodes[m].type === "Saved Function") {
								let pos = parseInt(line.to_type.split(" ")[0]);
								job.from[pos-1] = data.nodes[l].index;
							} else if (data.nodes[m].type === "Join Datasets") {
								job.from.push(data.nodes[l].index);
							}
							else job.from = data.nodes[l].index;
						}
					}
				} else if (line.from === job.id) {
					for (l in data.nodes) {
						if (data.nodes[l]._id === line.to) {
							job.next.push(data.nodes[l].index);
						}
					}
				}
			});

			// Properties specific to the Saved Function job
			if (data.nodes[m].type === "Saved Function") {
				job.from = job.from.filter((a) => a);
				job.title = "function"

				// Get function JSON
				try {
					const resp = await fetch(`/functions/get/${data.nodes[m].name}`)
					var response = await resp.json();
				} catch (error) {
					console.log(error);
				}
				job.function = response
			}

			// Properties specific to the Dataset job
			if (data.nodes[m].type === "Dataset") {
				job.label = data.nodes[m].property;
				data.metadata.datasets.push(data.nodes[m].property);
			}

			// Properties specific to the Data Join job
			if (data.nodes[m].type === "Join Datasets") {
				job.title = "data-join";
				job["join-type"] = data.nodes[m].property.toLowerCase();
				if (job["join-type"] === "select join") job["join-type"] = "join";
				job.column = data.nodes[m].field.toLowerCase();
			}

			// Properties specific to the Classification and Regression jobs
			if (data.nodes[m].type === "Classification" || data.nodes[m].type === "Regression") {
				job.algorithm = data.nodes[m].property.toLowerCase();
				if (job.algorithm === "select algorithm") job.algorithm = false;
				job.column = data.nodes[m].field.toLowerCase();
			}

			// Properties specific to the Cleaning job
			if (data.nodes[m].type == "Cleaning") {
				if (data.nodes[m].field === "") {
					job["max-shrink"] = false;
				} else {
					job["max-shrink"] = parseFloat(data.nodes[m].field);
				}
			}

			data.jobs.push(job);
		}

		// Calculate the next property of the last node
		for (m in data.jobs) {
			if (data.jobs[m].next.length === 0) data.jobs[m].next.push(0);
		}

		// Add args to each Function job
		for (a in data.nodes) {
			if (data.nodes[a].type === "Saved Function") {

				data.nodes[a].field.forEach((arg, i) => {
					data.jobs.forEach((job) => {
						if (job.id === data.nodes[a]._id) {

							if ((job.function.args[i].type).includes("column")) {
								job.function.args[i].feature = arg;
							} else {
								job.function.args[i].value = arg;
							}
						}
					})
				})

			}
		}

		// Calculate the args for each Saved Function by
		// backgracking the graph to find the nearest Dataset node

		// for (a in data.nodes) {
		// 	if (data.nodes[a].type === "Saved Function") {

		// 		// Add int values to final graph -------------------------------
		// 		data.nodes[a].field.forEach((arg, i) => {
		// 			data.jobs.forEach((job) => {
		// 				if (job.id === data.nodes[a]._id) {
		// 					if (!(job.function.args[i].type).includes("column")) {
		// 						job.function.args[i].value = arg;
		// 					}
		// 				}
		// 			})
		// 		})
		// 		// -------------------------------------------------------------

		// 		let temp = data.nodes[a]._id;
		// 		console.log("Temp is: ",  data.nodes[a].type);
		// 		let exploredLines = []

		// 		for (let ind = 0; ind < linesArray.length; ind++) {
		// 			if (linesArray[ind].to === temp) {

		// 				if (exploredLines.findIndex((obj) => obj._id === linesArray[ind]._id) !== -1) {
		// 					console.log("Found explored line: ", linesArray[ind]._id);
		// 					continue;
		// 				}

		// 				// If the line ends in a Saved Function then save the end number
		// 				if (!isNaN(parseInt(linesArray[ind].to_type.split(" ")[0]))) {
		// 					var pos = parseInt(linesArray[ind].to_type.split(" ")[0]) - 1
		// 					var explored = ind
		// 				}

		// 				console.log("Exploring line: ", linesArray[ind]._id);

		// 				for (b in data.nodes) {
		// 					if (data.nodes[b]._id === linesArray[ind].from) {

		// 						if (data.nodes[b].type === "Dataset") {

		// 							let feature = data.nodes[b].selectedFeature;

		// 							data.jobs.forEach((job) => {
		// 								if (job.id === data.nodes[a]._id) {

		// 									job.function.args[pos].feature = feature;
		// 									console.log("Added to ", pos, "arg feature: ", feature);
		// 									exploredLines.push(linesArray[explored])
		// 									console.log("Added explored line: ", linesArray[explored]._id);
		// 									temp = data.nodes[a]._id;
		// 									console.log("New temp is: ",  data.nodes[a].type);
		// 								}
		// 							})

		// 							break;
		// 						}
		// 						else {
		// 							temp = data.nodes[b]._id
		// 							console.log("New temp is: ", data.nodes[b].type);
		// 							ind=-1;
		// 							break;
		// 						}
		// 					}
		// 				}
		// 			}
		// 		}
		// 	}
		// }

		// Determine if auto modelling is enabled or not
		if ($("#checkbox").is(':checked')) {
			data.automodel = true;
		} else {
			data.automodel = false;
		}

		return data;
	}

	// Save graph to application
	$('#save_graph').click( async ()=>{

		if ($("#save_graph_input").val() === "") {
			toastr.error("Please give a name to your analysis graph.", "Notification:");
		} else {

			if (validateFields()) {
				
				let data = await generateData();

				let name = $("#save_graph_input").val();
	
				data['analysis-name'] = name
	
				// Send pipeline to server
				try {
					let resp = await fetch("/pipelines/save", {
						method: 'POST',
						headers: {'Content-Type': 'application/json'},
						body: JSON.stringify(data)
					})
					var response = await resp;
				} catch (error) {
					console.log(error);
				}
	
				// Check response
				if (response.statusText === "OK") {
	
					$("#save_graph_input").val("")
					$('#saveGraphModal').modal('hide');
	
					sessionStorage.setItem("showmsg", "1");
	
					window.location.replace("/modelling");
				} else {
					toastr.error("This name is used by another pipeline.", "Notification:");
				}

			} else {
				toastr.error("Please fill all the required fields.", "Notification:");
			}
		}
	});

	// Validate graph
	$('#validate_graph').click( async ()=> {
		if (validateFields()) {

			let data = await generateData();

			try {
				let resp = await fetch("/pipelines/validate", {
					method: 'POST',
					headers: {'Content-Type': 'application/json'},
					body: JSON.stringify(data)
				})
				var response = await resp;
			} catch (error) {
				console.log(error);
			}
			
			let text = await response.text();

			switch (response.status) {
				case 200:
					toastr.info("Pipeline is valid and ready for deployment.", "Notification:");
					$("#deploy_graph").attr("disabled", false);		
					break;
			
				case 425:
					toastr.warning(text, "Issues found:");	
					toastr.info("Minor issues that don't affect deployment.", "Notification:");
					$("#deploy_graph").attr("disabled", false);		
					break;

				case 409:
					toastr.error(text, "Issues found:");	
					toastr.info("Critical issues that affect deployment.", "Notification:");
					break;

				default:
					break;
			}
			
		} else {
			toastr.error("Please fill all the required fields.", "Notification:");
		}
	})

	// Load data

	// $('#save_data').click(()=>{

	// 	let data = $("#flowchart_data").val();

	// 	try {
	// 		data = jQuery.parseJSON(data);

	// 		// Make nodes ---------------
	// 		for (i in data.nodes) {
	// 			let node = data.nodes[i];
	// 			diagram.push(node);
	// 		}
	// 		renderDiagram(diagram);

	// 		// Make lines ----------------------------------------------------------------------
	// 		for (o in data.connections) {
	// 			let line = data.connections[o];

	// 			let fromChildren = $('#'+line.from).find(".flowchart-operator-connector-arrow");
	// 			let toChildren = $('#'+line.to).find(".flowchart-operator-connector-arrow");

	// 			let newLine = new LeaderLine(
	// 				LeaderLine.pointAnchor(fromChildren[0]),
	// 				LeaderLine.pointAnchor(toChildren[0]),
	// 				{
	// 					startPlug: 'disc',
	// 					endPlug: 'disc',
	// 					startPlugColor: '#3a91b3',
	// 					endPlugColor:'#3a91b3',
	// 					startPlugSize: 0.7,
	// 					endPlugSize: 0.7,
	// 					color:'#3a91b3',
	// 					startSocket:'right',
	// 					endSocket:'left',
	// 					size: 5
	// 				}
	// 			);

	// 			newLine["from"] = line.from;
	// 			newLine["to"] = line.to;

	// 			linesArray.push(newLine);
	// 		}

	// 		// Tick automodel if needed -------------
	// 		if (data.automodel === true) {
	// 			$("#checkbox").prop("checked", true);
	// 		}

	// 		$('#diagrambtn').removeClass("active");
	// 		$("#diagram").collapse('toggle');
	// 		renderDiagram(diagram);
	// 	} catch (e) {
	// 		toastr.error("Please insert valid JSON format.", "Notification:");
	// 		return false;
	// 	}
	// });


	// Deploy graph
	$('#deploy_graph').click(async ()=>{
		if (validateFields()) {
			let data = await generateData();

			// Send data to server for orchestrator
			fetch("/messages", {
				method: 'POST',
				headers: {'Content-Type': 'application/json'},
				body: JSON.stringify({message:"send-to-orchestrator", info:data})
			})
			.then(res => {
				console.log("Data sent to backend", res);
			});

		} else {
			toastr.error("Please fill all the requied fields.", "Notification:");
		}
	});

	// Download graph
	$('#download_graph').click( async () => {

		if ($("#download_graph_input").val() === "") {
			toastr.error("Please give a name to your analysis graph.", "Notification:");
		} else {
			if (validateFields()) {

				let data = await generateData();
				console.log(data);
				download(JSON.stringify(data, null, 2), "data.json", "text/plain");

				$("#download_graph_input").val("")
				$('#downloadGraphModal').modal('hide');

				toastr.info("Graph was downloaded successfully.", "Notification:");

			} else {
				toastr.error("Please fill all the requied fields.", "Notification:");
			}
		}
	});

	// Unzoom canvas
	let scale = 1.0
	$('#unzoomcanvas').click(() => {

		let newscale = 0;

		$("#flowchartworkspace").children('.ui-draggable').each((i, obj) => {
			let target = $(obj);

			target.css('transform', 'scale('+scale+')')
			newscale = scale - 0.13
			newscale.toFixed(2)
			if (newscale >= 0.6) {
				target.css('transform', 'scale('+newscale+')');
			}
		});

		if (newscale >= 0.6) {
			scale = newscale;
			reDraw()
		} else {
			toastr.error("Max zoom out reached.", "Notification:");
		}
		console.log(scale);
	});

	// Zoom canvas
	$('#zoomcanvas').click(() => {

		let newscale = 0;

		$("#flowchartworkspace").children('.ui-draggable').each((i, obj) => {
			let target = $(obj);

			target.css('transform', 'scale('+scale+')');
			newscale = scale + 0.13
			console.log("scale",newscale);
			newscale.toFixed(2)
			if (newscale <= 1.5) {
				target.css('transform', 'scale('+newscale+')');
			}
		});

		if (newscale <= 1.5) {
			scale = newscale;
			reDraw()
		} else {
			toastr.error("Max zoom in reached.", "Notification:");
		}
		console.log(scale);

	});

	// Go to dashboard button
	$('#dashb').click(()=> {
		let url = window.location.origin;
		window.location.replace(url+"/pipelines");
	});
});

var count = 0;
var start_id = 0
var end_id = 0;
var dots = [];
var tobedeleted = [];
var linepos = [];

function download(content, fileName, contentType) {
	const a = document.createElement("a");
	const file = new Blob([content], { type: contentType });
	a.href = URL.createObjectURL(file);
	a.download = fileName;
	a.click();
}

function getParams(params) {
	const queryString = window.location.search;
	const urlParams = new URLSearchParams(queryString);
	const code = urlParams.get(params);
	return code;
}

function drawLine(item) {

	count++;

	// Set up a parent array
	var parents = [];
	// Push each parent element to the array
	for ( ; item && item !== document; item = item.parentNode ) {
		parents.push(item);
	}

	let id = parents[6].id
	let dot = parents[0];

	// Set start node
	if (count == 1) {
		dots.push(dot);
		for (o in diagram) {
			if (diagram[o]._id == id) {
				start_id = diagram[o]._id;
			}
		}
	// Set end node
	} else if (count == 2) {

		dots.push(dot);

		for (o in diagram) {
			if (diagram[o]._id == id) {
				end_id = diagram[o]._id;
			}
		}

		// Check if the same node was clicked twice
		if (start_id === end_id) {
			count = 0;
			dots= [];
			return;
		}

		// Draw the line
		var line = new LeaderLine(
			LeaderLine.pointAnchor(dots[0]),
			LeaderLine.pointAnchor(dots[1]),
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

		line["from"] = start_id;
		line["to"] = end_id;
		line["to_type"] = dot.previousElementSibling.innerHTML;

		linesArray.push(line);
		dots = [];

		count = 0;
	}
}

function editNode(element) {
	// Set up a parent array
	let parents = [];
	// Push each parent element to the array
	for ( ; element && element !== document; element = element.parentNode ) {
		parents.push(element);
	}
	let elemid = parents[0].id;
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

	// Change property of node object
	window.changeProperty = async function (node) {

		if (node.id === "datasetProperty") {
			try {
				var resp = await fetch("/datasets/features", {
					method: "POST",
					headers: {
						'Accept': 'application/json',
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({dataset:node.value})
				});
				var features = await resp.json();

				diagram[pos].property = node.value;
				diagram[pos].features = features;

				//renderDiagram(diagram)
			} catch (error) {
				console.log(error);
			}

		// } else if (node.id === "datasetFeatures") {
		// 	diagram[pos].selectedFeature = node.value;

		// 	let dataset = node.previousElementSibling.value;

		// 	try {
		// 		var resp = await fetch("/datasets/features", {
		// 			method: "POST",
		// 			headers: {
		// 				'Accept': 'application/json',
		// 				'Content-Type': 'application/json',
		// 			},
		// 			body: JSON.stringify({dataset:dataset})
		// 		});
		// 		var feats = await resp.json();
		// 	} catch (error) {
		// 		console.log(error);
		// 	}
			
		// 	feats.forEach((feat) => {
		// 		if (feat.name === node.value) {
		// 			if (feat.positive === true) {
		// 				toastr.info("Feature contains all positive numbers", "Notification:");
		// 			} else if (feat.negative === true) {
		// 				toastr.info("Feature contains all negative numbers", "Notification:");
		// 			} else if (feat.positive === false && feat.negative === false) {
		// 				if (feat["all-zero"] === true) {
		// 					toastr.info("Feature contains all zeros", "Notification:");
		// 				} else {
		// 					toastr.info("Feature contains both positive and negative numbers", "Notification:");
		// 				}
		// 			}
		// 		}
		// 	});

		} else {
			diagram[pos].property = node.value;
		}
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
		renderDiagram(diagram);
	};
}

function editColumn(element) {
	// Set up a parent array
	let parents = [];

	// Push each parent element to the array
	for ( ; element && element !== document; element = element.parentNode ) {
		parents.push(element);
	}
	let elemid = $(parents).filter('.ui-draggable').attr('id');

	// Click field to add field property (column) to node object
	$('#'+elemid+'  input[name="field"]').keyup(function(){
		for (s in diagram) {
			if (diagram[s]._id == elemid) {

				diagram[s].field = $(this).val();

				// Cleaning service max shrink validation check ---------------------------- //
				if (diagram[s].property === "Cleaning") {
					if (isNaN($(this).val())) {
						toastr.error("Please enter a numeric value between 0 and 1.", "Notification:");
						$(this).val("")
					}
					if ($(this).val() < 0 || $(this).val()> 1) {
						toastr.error("Please enter a value between 0 and 1.", "Notification:");
						$(this).val("")
					}
				}
				// ------------------------------------------------------------------------ //
			}
		}
	});

	// Click field to add func_input_num property to node object
	$('#'+elemid+'  input[name="func_input_num"]').keyup(function(){
		for (s in diagram) {
			if (diagram[s]._id == elemid) {

				diagram[s].field[$(this)[0].id] = $(this).val();

				if (isNaN($(this).val())) {
					toastr.error("Please enter a numeric value.", "Notification:");
					$(this).val("")
				}

			}
		}
	});

	// Click field to add func_input_col property to node object
	$('#'+elemid+'  input[name="func_input_col"]').keyup(function(){
		for (s in diagram) {
			if (diagram[s]._id == elemid) {

				diagram[s].field[$(this)[0].id] = $(this).val();

				if (typeof $(this).val() !== "string") {
					toastr.error("Please enter a string value.", "Notification:");
					$(this).val("")
				}

			}
		}
	});
}

function reDraw() {
	for (var d in diagram) {


		// Redraw each connected line
		let templines = [];
		for (k in linesArray) {

			let fromid = linesArray[k].from;
			let toid = linesArray[k].to;
			let to_type = linesArray[k].to_type;

			let elemfrom = document.getElementById(fromid);
			let elemto = document.getElementById(toid);

			let fromchildren = $(elemfrom).find('*');
			let tochildren = $(elemto).find('*');

			// Calculate from dot and to dot
			let obj = $(fromchildren).find('div.flowchart-operator-outputs')
			var nodefrom = obj[0].firstElementChild.firstElementChild.children[1]

			let type = $(tochildren).find('div:contains("'+to_type+'")');
			var nodeto = type[4].nextElementSibling;

			linesArray[k].remove();
			linesArray.splice(k,1);

			var line = new LeaderLine(
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

			line["from"] = fromid;
			line["to"] = toid;
			line["to_type"] = to_type;

			templines.push(line);
		}
		linesArray = linesArray.concat(templines);
	}
}

function minimize() {
	$("#delete_node").toggleClass('resizeDel');
	$("#delete_node").html((i, text)=>{
		return text === "Delete selected" ? "<i class='fas fa-trash-alt' style='font-size:15px'margin-left:-10px></i>" : "Delete selected";
	});
}

function validateFields() {
	let outcome = true;
	for (m in diagram) {

		if (diagram[m].type === "Classification" || diagram[m].type === "Regression" || diagram[m].type === "Join Datasets") {
			if (diagram[m].field === "") {
				outcome = false;
			};
		}

		if (diagram[m].type === "Cleaning") {
			if (diagram[m].field === "") {
				outcome = false;
			}
		}

		if (diagram[m].type === "Saved Function") {
			diagram[m].field.forEach((f) => {
				if (f === "") {
					outcome = false;
				}
			});
		}

		if (diagram[m].type === "Dataset") {
			if (diagram[m].property === "Select Dataset") {
				outcome = false;
			}
		}
	}
	return outcome;
}

// Click anywhere to hide node delete btn
$('html').click(function() {
	$("#delete_node").hide();
	tobedeleted = [];

	console.log(diagram);
	console.log(linesArray);
});