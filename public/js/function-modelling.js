
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

// Display toast after save and redirect
if(sessionStorage.getItem("showmsg")=='1'){
	toastr.success("Graph was saved successfully.", "Notification:");
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
		
		// Adjust position of the node
		node.position.top +=25;

		diagram.push(node);
		renderDiagram();
	}
});

// Save graph to application
$('#save_graph').click(()=>{

	if ($("#save_graph_input").val() === "") {
		toastr.error("Please give a name to your function.", "Notification:");
	} else {

		let name = $("#save_graph_input").val()

		let data = generateData(name);

		fetch("/functions/save", {
			method: 'POST',
			headers: {'Content-Type': 'application/json'},
			body: JSON.stringify(data)
		})
		.then(dataWrappedByPromise => data)
		.then(data => {
			$("#save_graph_input").val("")
			$('#saveGraphModal').modal('hide');

			sessionStorage.setItem("showmsg", "1");

			window.location.replace("/function-modelling");
		})

		
	}
});

// Clear graph
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
	if ($("#download_graph_input").val() === "") {
		toastr.error("Please give a name to your function.", "Notification:");
	} else {

		let name = $("#download_graph_input").val();

		let data = generateData(name);
		download(JSON.stringify(data, null, 2), name+".json", "text/plain");

		$("#download_graph_input").val("")
		$('#downloadGraphModal').modal('hide');

		toastr.success("Graph was downloaded successfully.", "Notification:");
		
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