$(document).ready(function () {

	$((new PluginsManager()).availablePlugins).each(function (index, pluginS) {
		var plugin = (new pluginS());
		var pluginItemSource =
			"<tr><td><div class='PluginItem" + (plugin.PBet ? " BetaFlag" : "") + "'><table id='samplePlugin'><tr><td class='PluginOptions'><table><tr><td>" +
			"<img id='PImage" + plugin.PAli + "' src='" + Helpers.GetImageURL("Plugins", plugin.PImg) + "' alt='&lt;" + plugin.PNam + "&gt;' />" +
			"</td></tr><tr><td>" +
			"<input id='PActive" + plugin.PAli + "' type='checkbox' class='ui-helper-hidden-accessible' />" +
			"<label id='PActiveLabel" + plugin.PAli + "' for='PActive" + plugin.PAli + "' class='ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only' role='button' aria-disabled='false' />" +
			"</td></tr></table></td><td><table><tr>" +
			"<td>" + plugin.PNam + "</td>" +
			"<td class='PluginVersion'>(" + plugin.PVer + ")</td>" +
			"</tr><tr class='PluginDescription'><td colspan='2'>" +
			"<p>" + plugin.PDes + "</p>" +
			"</td></tr><tr class='PluginAuthor'>" +
			"<td>" + plugin.PAut + "</td><td><a href='&lt;" + plugin.PMIS + "&gt;'>More info...</a>" +
			"</td></tr></table></td></tr></table></div></td></tr>";
		$("#pluginsTable").append(pluginItemSource);

		// Gets active state
		var activeState = localStorage.getItem("PActive" + plugin.PAli);
		if (activeState === null) {
			localStorage.setItem("PActive" + plugin.PAli, "On");
			activeState = "On";
		}

		// Assigns that state to control
		if (activeState == "On") $("#PActive" + plugin.PAli).attr("checked", true);
		else $("#PActive" + plugin.PAli).attr("checked", false);

		// On click event
		$("#PActive" + plugin.PAli).button().click(function () {
			var currentState = $("#PActive" + plugin.PAli).attr("checked") == null ? "Off" : "On";
			$("#PActiveLabel" + plugin.PAli + " span").text(currentState == "On" ? "On" : "Off");
			$("#PImage" + plugin.PAli).attr("class", (currentState == "On" ? " " : "Disabled"));
			localStorage.setItem("PActive" + plugin.PAli, currentState);
		});

		// Activate initial control state
		$("#PActiveLabel" + plugin.PAli + " span").text(activeState == "On" ? "On" : "Off");
		$("#PImage" + plugin.PAli).attr("class", (activeState == "On" ? " " : "Disabled"));
	});

});