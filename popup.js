$(function() {	
	
	var urls = {};

	$('#search_term').focus();
	if ($("#data_table tbody").length == 0) {
		$("#data_table").append("<tbody></tbody>");
	}

	chrome.tabs.query({}, function(tabs) {		
		for (var i = 0; i < tabs.length; i++) {			
			var iconPath = "";
			if(tabs[i].favIconUrl)
				iconPath = "<img class='logo_tab' src='" + tabs[i].favIconUrl + "'/>";
			else
				iconPath = "<div/>"
			$("#data_table tbody").append(
	        	"<tr id='" + tabs[i].id + "' class='tab_row' tabindex='0'>" +
					"<td class='icon_td'>" + iconPath + "</td>" +
					"<td class='title_td title_existing' title='" + tabs[i].title + "' id='title_" + tabs[i].id + "'><p>" +
						"<div class='title_div'>" + truncateText(tabs[i].title, 40) + "</div>" + "\n" +
						"<div class='url_div'>" + truncateText(tabs[i].url, 50) + "</div>" +
					"</p></td>" +
					"<td>" + 
						"<button class='duplicate' style=" + getStyle(tabs[i].url) + ">Dup</button>" +
						"</td>" + 
					"<td>" + 
						"<img src='/images/close-icon.png' class='close-icon' id='icon_" + tabs[i].id + ")'></img>" +
					"</td>" + 
					"<td class='hidden_url' url='" + tabs[i].url + "'>"+ tabs[i].url + "</td>" +
				"</tr>"
		  	);
		  	urls[tabs[i].url] = true;
		}
	}); 	

	$("#data_table").on('click','.close-icon',function(e) {
		var id = $(this).attr("id").replace("icon_", "");
		var tabId = parseInt(id);
		chrome.tabs.remove(tabId, function() {
			$("#" + tabId).remove();
		});
	});	

	function getStyle(url) {
		if(urls[url])
			return "display:block";
		else
			return "display:none";
	}

	$("#data_table").on( "keydown", "tr", function(event) {		
    	if(event.which == 13) {        	
	        var tabId = parseInt($(this).attr("id"));		
	        changeTab(tabId);
		}
		else if(event.which == 39 || event.which == 40) { //down or right arrow			
			$(this).nextAll().filter(":visible:first").focus();
		}
		else if(event.which == 37 || event.which == 38) { //up or left arrow			
			if($(this).prev().filter(":visible:first").length == 0) 								
				$("#search_term").focus();	
			else 
				$(this).prevAll().filter(":visible:first").focus();									
		}
		else if(event.which == 8) { // delete button			
			var tabId = parseInt($(this).attr("id"));		
			chrome.tabs.remove(tabId, function() {								
				$("#" + tabId).next().focus();
				$("#" + tabId).remove();				
			});
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
			$("#data_table>tbody>tr").filter(":visible:first").focus();			
		}
	    var value = $(this).val().toLowerCase();
	    $("#data_table tr").filter(function() {
	      $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
	    });
  	});

	function truncateText(str, strLength) {
     	return str.length > strLength ? str.substring(0, strLength - 3) + '...' : str;
  	}	
});

