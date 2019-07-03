$(function() {	
	var strLength = 30;
	$('#search_term').focus();
	if ($("#data_table tbody").length == 0) {
		$("#data_table").append("<tbody></tbody>");
	}

	chrome.tabs.query({}, function(tabs) {
		console.log('i m here' + JSON.stringify(tabs));

		for (var i = 0; i < tabs.length; i++) {			
			var iconPath = "";
			if(tabs[i].favIconUrl)
				iconPath = "<img class='logo_tab' src='" + tabs[i].favIconUrl + "'/>";
			else
				iconPath = "<div/>"
			$("#data_table tbody").append(
	        	"<tr id='" + tabs[i].id + "' class='tab_row' tabindex='0'>" +
	        		"<td class='icon_td'>" + iconPath + "</td>" +
		        	"<td class='title_td' title='" + tabs[i].title + "'>" +  truncateText(tabs[i].title) + "</td>" +
	      		"</tr>"
		  	);
		}
	}); 	

	$("#data_table").on( "keydown", "tr", function(event) {
    	if(event.which == 13) {        	
	        var tabId = parseInt($(this).attr("id"));		
	        changeTab(tabId);
		}
		else if(event.which == 39 || event.which == 40) { //down or right arrow
			console.log("next");
			$(this).nextAll().filter(":visible:first").focus();
		}
		else if(event.which == 37 || event.which == 38) { //up or left arrow
			console.log('previous');
			if($(this).prev().length == 0)				
				$("#search_term").focus();	
			else {
				$(this).prevAll().filter(":visible:first").focus();						
			}
		}
    });
  
	$("#data_table").on('click','tr',function(e) { 	    
		var tabId = parseInt($(this).attr("id"));		
		changeTab(tabId);
	});

	function changeTab(tabId) {
		chrome.tabs.get(tabId, function(tab) {
			chrome.windows.update(tab.windowId, {"focused": true }, function() {});
			chrome.tabs.highlight({'tabs': parseInt(tab.index), windowId: tab.windowId}, function() {});
		});
	}

	$("#search_term").on("keyup", function(event) {
		if(event.which == 40) { //down or right arrow
			console.log("next");
			$("#data_table>tbody>tr").filter(":visible:first").focus();			
		}
	    var value = $(this).val().toLowerCase();
	    $("#data_table tr").filter(function() {
	      $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
	    });
  	});

	function truncateText(str) {
     	return str.length > strLength ? str.substring(0, strLength - 3) + '...' : str;
  	}	
});

