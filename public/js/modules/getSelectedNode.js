function getSelectedNode() {
	
	$('.ui-draggable').each(function(i, obj) {
		if ($(obj).is('.selected-node')) {
			deleteNode(obj.id);
		}
	});

}