$(document).ready(function () {
	$.each(
		GlobalPluginsList,
		function (index, obj) {
			drawTable(obj);
			actionTable(obj);
		}
	);
});

function drawTable(obj) {
	if($("."+obj.Category).length == 0)
		$("#PluginsTable").append("<div class='PluginCat "+obj.Category+"'><h1>"+obj.Category+"</h1></div>");
	var pluginItem = "\
		<div class='PluginItem" + (obj.Flags.Alpha ? " AlphaFlag" : "") + (obj.Flags.Beta ? " BetaFlag" : "") + "'>\
			<div style='float:left;' class='PluginOptions'>\
				<div>\
					<img id='PluginImage" + obj.Name + "' src='" + GetPluginImage(obj) + "' alt='&lt;" + obj.Alias + "&gt;' />\
				</div>\
				<div>\
					<input id='PluginActive" + obj.Name + "' type='checkbox' class='ui-helper-hidden-accessible'" + (obj.Settings.Changeable ? "" : "disabled")+"/>\
					<label id='PluginActiveLabel" + obj.Name + "' for='PluginActive" + obj.Name + "' class='ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only' role='button' aria-disabled='false' />\
				</div>\
			</div>\
			<div style='float:right;' class='PluginInfo'>\
				<div>\
					<div style='float:left;'>" + obj.Alias + "</div>\
					<div style='float:right;' class='PluginVersion'>(" + obj.Version + ")</div>\
					<br style='clear:both;'>\
				</div>\
				<div class='PluginDescription'>\
					<p>" + obj.Description + "</p>\
				</div>\
				<div class='PluginAuthor'>\
					<div style='float:left;'>" + obj.Author + "</div>\
					<div style='float:right;'><a target='_blank' href='" + obj.Site + "'>More info...</a></div>\
					<br style='clear:both;'>\
				</div>\
			</div>\
			<br style='clear:both;'>\
		</div>";
	$($("."+obj.Category)).append(pluginItem);
}

function actionTable(obj) {
	// Sets flags
	// NOTE Not yet supported
	//if (obj.Flags.Internal == true) $("#PluginItem").addClass("InternalFlag");
	//if (obj.Flags.Featured == true) $("#PluginItem").addClass("FeaturedFlag");

	// Gets active state
	var activeState = getActiveState(obj);

	// Assigns that state to control
	if (activeState == "On") $("#PluginActive" + obj.Name).attr("checked", true);
	else $("#PluginActive" + obj.Name).attr("checked", false);

	// On click event
	$("#PluginActive" + obj.Name).button().click(function () {
		var currentState = $("#PluginActive" + obj.Name).attr("checked") == null ? "Off" : "On";
		$("#PluginActiveLabel" + obj.Name + " span").text(currentState == "On" ? "On" : "Off");
		$("#PluginImage" + obj.Name).attr("class", (currentState == "On" ? " " : "Disabled"));
		localStorage.setItem("IsPluginActive" + obj.Name, JSON.stringify({ State: currentState }));
	});
	
	// Is plugin Changeable
	if(!obj.Settings.Changeable) localStorage.setItem("IsPluginActive" + obj.Name, JSON.stringify({ State: obj.Default.State }));

	// Activate initial control state
	$("#PluginActiveLabel" + obj.Name + " span").text(activeState == "On" ? "On" : "Off");
	$("#PluginImage" + obj.Name).attr("class", (activeState == "On" ? " " : "Disabled"));
}

function getActiveState(obj) {
	var activeState = null;
	var stateObject = JSON.parse(localStorage.getItem("IsPluginActive" + obj.Name));
	if (stateObject === null) {
		activeState = obj.Default.State;
		localStorage.setItem("IsPluginActive" + obj.Name, JSON.stringify({ State: activeState }));
	}
	else activeState = stateObject.State;
	
	return activeState;
}