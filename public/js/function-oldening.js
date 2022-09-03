var diagram = [];
var linesArray = [];

$("#delete_node").hide();

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
			var node = {
				_id: (new Date).getTime(),
				position: ui.helper.position(),
				property:ui.helper[0].children[1].innerHTML
			};
			if(node.property == "Classification" || node.property == "Regression" || node.property == "Cleaning" || node.property == "Data Ingestion" || node.property == "Join Datasets") {
				node.field = ''
				if (node.property == "Data Ingestion") {
					node.link = ''
					node.token = ''
				}
				if(node.property == "Classification" || node.property == "Regression") {
					node.property = "Select Algorithm"
				}
				if(node.property == "Join Datasets") {
					node.property = "Select Join"
				}
			}
			
			// node.position.top +=220;
			node.position.top +=125;

			// get tool name
			node.type = ui.helper[0].children[1].innerHTML;

			diagram.push(node);
			renderDiagram(diagram);
		}
	});

	window.renderDiagram = function (diagram) {
		canvas.empty();
		for (var d in diagram) {
			var node = diagram[d];
			var html = "";

			switch (node.type) {
				case "Data Load":
					html = dataload;
					break;
				case "Data Sink":
					html = sink;
					break;
				case "Data Ingestion":
					html = ingestion1 + '<input type="text" name="field" class="form-control column" style="margin:auto auto 15px auto;width:80%;height:70%" onclick="editColumn(this)" value="'+node.field+'"></input>' + ingestion2 + '<input type="text" name="link" class="form-control column" style="margin:auto auto 15px auto;width:80%;height:70%" onclick="editColumn(this)" value="'+node.link+'"></input>' + ingestion3 + '<input type="text" name="token" class="form-control column" style="margin:auto auto 15px auto;width:80%;height:70%" onclick="editColumn(this)" value="'+node.token+'"></input>' + ingestion4;
					break;
				case "Join Datasets":
					html = datajoin1 + '<option selected="true" disabled="disabled" value="default">'+node.property+'</option>' + datajoin2 + '<input type="text" name="field" class="form-control column" style="margin:auto auto 15px auto;width:80%;height:70%" onclick="editColumn(this)" value="'+node.field+'"></input>' + datajoin3;
					break;
				case "Classification":
					html = classification1 + '<option selected="true" disabled="disabled" value="default">'+node.property+'</option>' + classification2 + '<input type="text" name="field" class="form-control column" style="margin:auto auto 15px auto;width:80%;height:70%" onclick="editColumn(this)" value="'+node.field+'"></input>' + classification3;
					break;
				case "Regression":
					html = regression1 + '<option selected="true" disabled="disabled" value="default">'+node.property+'</option>' + regression2 + '<input type="text" name="field" class="form-control column" style="margin:auto auto 15px auto;width:80%;height:70%" onclick="editColumn(this)" value="'+node.field+'"></input>' + regression3;
					break;
				case "Cleaning":
					html = cleaning1 + '<input type="text" inputmode="numeric" name="field" class="form-control column" style="margin:auto auto 15px auto;width:80%;height:70%" onclick="editColumn(this)" value="'+node.field+'"></input>' + cleaning2;
					break;
				default:
					break;
			}

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
	var data;
	function generateData() {

		const d = new Date();

		// Main json file template ---------------------------------------
		data = {
			"analysis-datetime" :"2021-10-06 02:55:45:796", //weird bug testing
			"diastema-token":"diastema-key",
			"analysis-id": $("#analysisid").val(),
			"database-id": "Metis",
			"jobs":[],
			"metadata":{
				"user": $("#user").val(),
				"analysis-date": ('0'+d.getDate()).slice(-2) + "-" + ('0'+(d.getMonth()+1)).slice(-2) + "-" + d.getFullYear(), 
				"analysis-time": ('0'+d.getHours()).slice(-2) + ":" + ('0'+d.getMinutes()).slice(-2) + ":" + ('0'+d.getSeconds()).slice(-2) + ":" + d.getMilliseconds()
			},
			"nodes":[],
			"connections":[]
		};

		// Get nodes -------------------
		for (l in diagram) {
			data.nodes.push(diagram[l]);
		}
		// Get connections ----------------------
		for (k in linesArray) {
			data.connections.push(linesArray[k]);
		}
		// Create jobs array --
		for (m in data.nodes) {

			// Job template
			let job = {
				"title":data.nodes[m].type.replace(/\s+/g, '-').toLowerCase(),
				"id":data.nodes[m]._id,
				"step":parseInt(m)+1,
				"from":'',
				"next":[],
				"save":false
			};

			// Calculate the next / from properties of every node
			// by looping through all existing connections and 
			// comparing node id's.
			if (job.step === 1 || data.nodes[m].type === "Data Ingestion") job.from = 0;
			if (data.nodes[m].type === "Join Datasets") job.from = [];
			let countNotLast = 0
			for (n in data.connections) {
				if (data.connections[n].to === job.id) {
					for (l in data.jobs) {
						if (data.jobs[l].id === data.connections[n].from) {
							data.jobs[l].next.push(job.step);
							if (data.nodes[m].type === "Join Datasets") {
								job.from.push(data.jobs[l].step);
							} else job.from = data.jobs[l].step;
							countNotLast +=1 ;
						}
					}
				}
			}

			// Properties specific to the Data Ingestion job
			if (data.nodes[m].type === "Data Ingestion") {
				job.method = "GET";
				job.link = data.nodes[m].link;
				job.token = data.nodes[m].token;
				job["dataset-name"] = data.nodes[m].field;
				if (job["dataset-name"] === "") {

					let found = 1;
					for (l in data.jobs) {
						if (data.jobs[l].title === "data-ingestion") {
							found +=1;
						}
					}

					job["dataset-name"] = "dataset-" + found + "-" + data["analysis-id"];
				}
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

		// Determine if auto modelling is enabled or not
		if ($("#checkbox").is(':checked')) {
			data.automodel = true;
		} else {
			data.automodel = false;
		}

		// Testing if nodes / connections work again
		// delete data.nodes;
		// delete data.connections;
	}

	// Save graph to application
	$('#save_graph').click(()=>{

		if ($("#save_graph_input").val() === "") {
			toastr.error("Please give a name to your analysis graph.", "Notification:");
		} else {
			generateData();
		
			data['analysis-name'] = $("#save_graph_input").val();

			fetch("/messages", {
				method: 'POST',
				headers: {'Content-Type': 'application/json'},
				body: JSON.stringify({message:"save-graph", info:data})
			})

			$("#save_graph_input").val("")
			$('#saveGraphModal').modal('hide');

			toastr.success("Graph was saved successfully.", "Notification:");
		}
	});

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
	$('#deploy_graph').click(()=>{
		if (validateFields()) {
			generateData();

			// Send data to backend
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
	$('#download_graph').click(()=>{
		if (validateFields()) {
			generateData();
			download(JSON.stringify(data, null, 2), "data.json", "text/plain");
		} else {
			toastr.error("Please fill all the requied fields.", "Notification:");
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
	console.log(id);

	// Set start node
	if (count == 1) {
		dots.push(dot);
		for (o in diagram) {
			if (diagram[o]._id == id) {
				// start = document.getElementById(diagram[o]._id);
				start_id = diagram[o]._id;
			}
		}
	// Set end node
	} else if (count == 2) {
		dots.push(dot);
		for (o in diagram) {
			if (diagram[o]._id == id) {
				// end = document.getElementById(diagram[o]._id);
				end_id = diagram[o]._id;
			}
		}

		if (dots[1] === dots[0]) {
			count = 1;
			return;
		}

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
	let title = parents[0];
	for (s in diagram) {
		if (diagram[s]._id == elemid) {
			var pos = s;
		}
	}

	// Click on title to show delete
	try {
		$("#"+elemid).click(function(event){
			event.stopPropagation();
			// $operatorProperties.show();
			$("#delete_node").show();
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
	let elemid = parents[2].id;

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

	// Click field to add link property to node object
	$('#'+elemid+'  input[name="link"]').keyup(function(){
		for (s in diagram) {
			if (diagram[s]._id == elemid) {
				diagram[s].link = $(this).val();
			}
		}
	});

	// Click field to add token property to node object
	$('#'+elemid+'  input[name="token"]').keyup(function(){
		for (s in diagram) {
			if (diagram[s]._id == elemid) {
				diagram[s].token = $(this).val();
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

			let elemfrom = document.getElementById(fromid);
			let elemto = document.getElementById(toid);

			let fromchildren = $(elemfrom).find('*');
			let tochildren = $(elemto).find('*');

			if (fromchildren[0].classList.contains("flowchart-operator-data-ingestion")) {
				console.log(fromchildren);
				var nodefrom = fromchildren[8];
			}
			if (fromchildren[0].classList.contains("flowchart-operator-data-load")) {
				var nodefrom = fromchildren[13];
			}
			if (tochildren[0].classList.contains("flowchart-operator-data-load")) {
				var nodeto = tochildren[7];
			}
			if (fromchildren[0].classList.contains("flowchart-operator-tool")) {
				var nodefrom = fromchildren[13];
			}

			if (tochildren[0].classList.contains("flowchart-operator-tool")) {
				var nodeto = tochildren[7];
			}
			if (tochildren[0].classList.contains("flowchart-operator-vis")) {
				var nodeto = tochildren[7];
			}

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

		if (diagram[m].type === "Data Ingestion") { 
			if (diagram[m].link === "" || diagram[m].token === "") {
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