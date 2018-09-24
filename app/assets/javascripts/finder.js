$( document ).ready(function() {
	$.get('/all_cities',{},function(data) {
		if($("#city").length > 0)
			$("#city").locationAutocomplete(data, "#hidden", "#city", "#state");
	});
});