$(document).ready(function () {
	// Go through all plugins in flobal list
	$.each(GlobalPluginsList, function (index, obj) {
		// Skip internal plugins if not in development mode
		if (obj.Flags.Internal && !IsDevelopmentMode) {
			console.warn("PluginsManagerPage: Internal plugin [" + obj.Name + "] ");
			return true;
		}

		// Append plugin item element and add actions to it
		DrawTable(obj);
		ActionTable(obj);
	});
	//$( ".Container" ).tabs({ fx: {opacity: 'toggle', duration: 300} });

	if (!IsDevelopmentMode) {
		// Initialize GA
		var _gaq = _gaq || [];
		_gaq.push(['_setAccount', 'UA-33221456-3']);
		_gaq.push(['_trackPageview']);

		(function () {
			var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
			ga.src = ('https:' == document.location.protocol ? 'https://' : 'http://') + 'stats.g.doubleclick.net/dc.js';
			var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
		})();
	}

	function DrawTable(obj) {
		// Create category if doesn't exist
		if ($("." + obj.Category).length == 0)
			$("#PluginsTable").append("<div class='PluginCat " + obj.Category + "'><h1>" + obj.Category + "</h1></div>");

		//if ($("." + obj.Category).length == 0) {
		//$(".Container ul").append('<li><a href="#'+obj.Category+'">'+obj.Category+'</a></li>');
		//$(".Container").append("<div id='"+obj.Category+"' class='PluginCat "+obj.Category+"'></div>");
		//}

		// Plugin image
		var pluginImage = $("<img>");
		pluginImage.attr("id", "PluginImage" + obj.Name);
		pluginImage.attr("src", GetPluginImage(obj));
		pluginImage.attr("alt", obj.Alias);

		// Plugin toggle button
		var pluginToggleButton = $("<div>");
		var pluginToggleButtonInput = $("<input>")
			.attr("id", "PluginActive" + obj.Name)
			.attr("type", "checkbox")
			.addClass("ui-helper-hidden-accessible");
		var pluginToggleButtonLabel = $("<label>")
			.attr("id", "PluginActiveLabel" + obj.Name)
			.attr("for", pluginToggleButtonInput.attr("id"))
			.addClass("ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only")
			.attr("role", "button")
			.attr("aria-disabled", "false");
		if (!obj.Settings.Changeable) pluginToggleButtonInput.addClass("disabled");
		pluginToggleButton.append(pluginToggleButtonInput);
		pluginToggleButton.append(pluginToggleButtonLabel);

		// Plugin options (image and button)
		var pluginOptions = $("<div>").addClass("PluginOptions");
		pluginOptions.append($("<div>").append(pluginImage));
		pluginOptions.append(pluginToggleButton);

		// Plugin details elements
		var pluginAlias = $("<div>").append(obj.Alias).addClass("PluginAlias");
		var pluginVersion = $("<div>").append(obj.Version).addClass("PluginVersion");
		var pluginDescription = $("<div>")
			.addClass("PluginDescription")
			.append($("<p>")
			.append(obj.Description));

		// Insert internal text if flaged next to plugin alias
		if (obj.Flags.Internal) pluginAlias.prepend($("<b>").append("INTERNAL").css("margin-right", "10px"));

		// Plugin footer
		var pluginFooter = $("<div>").addClass("PluginFooter");
		pluginFooter.append($("<div>").append(obj.Author).addClass("PluginAuthor"));
		pluginFooter.append($("<div>").addClass("PluginLink").append(
			$("<a>").attr("target", "_blank").attr("href", obj.Site).append("More info...")));
		pluginFooter.append($("<br>").css("clear", "both"));

		// Plugin details
		var pluginDetails = $("<div>").addClass("PluginInfo");
		pluginDetails.append($("<div>")
			.append(pluginAlias)
			.append(pluginVersion)
			.append($("<br>").css("clear", "both")));
		pluginDetails.append(pluginDescription);
		pluginDetails.append(pluginFooter);

		// Plugin element (root)
		var pluginElement = $("<div>").addClass("PluginItem");
		if (obj.Flags.Alpha) pluginElement.addClass("AlphaFlag");
		if (obj.Flags.Beta) pluginElement.addClass("BetaFlag");
		if (obj.Flags.Featured) pluginElement.addClass("FeaturedFlag");
		if (obj.Flags.Internal) pluginElement.addClass("InternalFlag");
		pluginElement.append(pluginOptions);
		pluginElement.append(pluginDetails);
		pluginElement.append($("<br>").css("clear", "both"));

		// Insert plugin to correct category
		$("." + obj.Category).append(pluginElement);
	};

	function ActionTable(obj) {
		// Gets active state
		var activeState = GetActiveState(obj);

		// Assigns that state to control
		if (activeState == "On") {
			$("#PluginActive" + obj.Name).attr("checked", true);
		}
		else {
			$("#PluginActive" + obj.Name).attr("checked", false);
			$("#PluginImage" + obj.Name).addClass("disabled");
		}

		// On click event
		$("#PluginActive" + obj.Name).button().click(function () {
			// Get new active state
			var nextState = $("#PluginActiveLabel" + obj.Name + " span").text() == "On" ? "Off" : "On";

			// Set label
			$("#PluginActiveLabel" + obj.Name + " span").text(nextState == "On" ? "On" : "Off");

			// Change image class
			if (nextState != "On")
				$("#PluginImage" + obj.Name).addClass("disabled");
			else $("#PluginImage" + obj.Name).removeClass("disabled");

			// Save active state
			localStorage.setItem("IsPluginActive" + obj.Name, JSON.stringify({ State: nextState }));
		});

		// Is plugin Changeable
		if (!obj.Settings.Changeable) localStorage.setItem("IsPluginActive" + obj.Name, JSON.stringify({ State: obj.Default.State }));

		// Activate initial control state
		$("#PluginActiveLabel" + obj.Name + " span").text(activeState == "On" ? "On" : "Off");
	};

	function GetActiveState(obj) {
		var activeState = null;

		// Gets currently set plugin state
		var stateObject = JSON.parse(localStorage.getItem("IsPluginActive" + obj.Name));

		// If satte is not set, save default state else 
		if (stateObject === null) {
			activeState = obj.Default.State;
			localStorage.setItem("IsPluginActive" + obj.Name, JSON.stringify({ State: activeState }));
		}
		else activeState = stateObject.State;

		return activeState;
	};
});
