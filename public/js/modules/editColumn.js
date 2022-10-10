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
			}
		}
	});
}