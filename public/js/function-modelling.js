
window.diagram = [];
window.linesArray = [];
window.tobedeleted = [];
window.canvas = $(".canvas");

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

// Display toast after save and redirect
if(sessionStorage.getItem("showmsg")=='1'){
	toastr.info("Function was saved successfully.", "Notification:");
	sessionStorage.removeItem("showmsg");
}

$("#delete_node").hide(); 

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

		let node = {
			_id: (new Date).getTime(),
			position: ui.helper.position(),
			property:dom.children[1].innerHTML,
			type:dom.dataset.type,
			inputs:parseInt(dom.dataset.inputs),
			outputs:parseInt(dom.dataset.outputs),
			color:dom.dataset.color
		}

		switch (node.type) {
			case "Saved-Function":
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
				node.lines = []
				break;
			case "Variable":
				node.field = '';
				break;
			default:
				break;
		}
		// Adjust position of the node
		node.position.top +=25;

		diagram.push(node);
		renderDiagram();
	}
});

// Save graph to application
$('#save_graph').click(async ()=>{

	if ($("#save_graph_input").val() === "") {
		toastr.error("Please give a name to your function.", "Notification:");
	} else {

		if (validateFields()) {
			
			let name = $("#save_graph_input").val()

			let data = generateData(name);

			// Manage complex function
			if (data.metadata["function-type"] === "complex") {

				// Turn complex function to simple
				try {
					var resp = await fetch("/messages", {
						method: 'POST',
						headers: {'Content-Type': 'application/json'},
						body: JSON.stringify({message:"save-complex", info:data})
					});
					var response = await resp.json();
				} catch (error) {
					console.log(error);	
				}

				// Send function to server
				try {
					let resp = await fetch("/functions/save", {
						method: 'POST',
						headers: {'Content-Type': 'application/json'},
						body: JSON.stringify(response)
					})
					var serverRes = await resp;
				} catch (error) {
					console.log(error);
				}

				// Check for duplicate name
				if (serverRes.statusText === "OK") {
					$("#save_graph_input").val("")
					$('#saveGraphModal').modal('hide');
			
					sessionStorage.setItem("showmsg", "1");
			
					window.location.replace("/function-modelling");
				} else {
					toastr.error("This name is used by another function.", "Notification:");
				}

			// Function was simple so save it
			} else {
				try {
					let resp = await fetch("/functions/save", {
						method: 'POST',
						headers: {'Content-Type': 'application/json'},
						body: JSON.stringify(data)
					})
					var serverRess = await resp;
				} catch (error) {
					console.log(error);
				}

				// Check for duplicate name
				if (serverRess.statusText === "OK") {
					$("#save_graph_input").val("")
					$('#saveGraphModal').modal('hide');
			
					sessionStorage.setItem("showmsg", "1");
			
					window.location.replace("/function-modelling");
				} else {
					toastr.error("This name is used by another function.", "Notification:");
				}
			}
		}
	}
});

// Clear graph
$('#deploy_graph').click(()=>{
	window.location.reload();
});

// Download graph
$('#download_graph').click(()=>{
	if ($("#download_graph_input").val() === "") {
		toastr.error("Please give a name to your function.", "Notification:");
	} else {

		let name = $("#download_graph_input").val();

		let data = generateData(name);
		download(JSON.stringify(data, null, 2), name+".json", "text/plain");

		$("#download_graph_input").val("")
		$('#downloadGraphModal').modal('hide');

		toastr.info("Graph was downloaded successfully.", "Notification:");
		
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
	window.location.replace(url+"/functions");
});

function minimize() {
	$("#delete_node").toggleClass('resizeDel');
	$("#delete_node").html((i, text)=>{
		return text === "Delete selected" ? "<i class='fas fa-trash-alt' style='font-size:15px'margin-left:-10px></i>" : "Delete selected";
	});
}

// Click anywhere to hide node delete btn
$('html').click(function() {
	$("#delete_node").hide();
	tobedeleted = [];

	console.log(diagram);
	console.log(linesArray);
});