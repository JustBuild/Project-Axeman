$(document).ready(function () {

	$.each(
		GlobalPluginsList,
		function (index, obj) {
			var pluginItemSource = 
				"<tr>\
					<td>\
						<div class='PluginItem" + (obj.Flags.Alpha ? " AlphaFlag" : "") + (obj.Flags.Beta ? " BetaFlag" : "") + "'>\
							<table style='width:100%'>\
								<tr>\
									<td class='PluginOptions'>\
										<table>\
											<tr>\
												<td>\
													<img id='PluginImage" + obj.Name + "' src='" + GetPluginImage(obj) + "' alt='&lt;" + obj.Alias + "&gt;' width='64' height='64' />\
												</td>\
											</tr>\
											<tr>\
												<td>\
													<input id='PluginActive" + obj.Name + "' type='checkbox' class='ui-helper-hidden-accessible' />\
													<label id='PluginActiveLabel" + obj.Name + "' for='PluginActive" + obj.Name + "' class='ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only' role='button' aria-disabled='false' />\
												</td>\
											</tr>\
										</table>\
									</td>\
									<td>\
										<table style='width:100%'>\
											<tr>\
												<td>" + obj.Alias + "</td>\
												<td class='PluginVersion'>(" + obj.Version + ")</td>\
											</tr>\
											<tr class='PluginDescription'>\
												<td colspan='2'>\
													<p>" + obj.Description + "</p>\
												</td>\
											</tr>\
											<tr class='PluginAuthor'>\
												<td>" + obj.Author + "</td>\
												<td><a target='_blank' href='" + obj.Site + "'>More info...</a></td>\
											</tr>\
										</table>\
									</td>\
								</tr>\
							</table>\
						</div>\
					</td>\
				</tr>";
			$("#PluginsTable").append(pluginItemSource);

			// Sets flags
			// NOTE Not yet supported
			//if (obj.Flags.Internal == true) $("#PluginItem").addClass("InternalFlag");
			//if (obj.Flags.Featured == true) $("#PluginItem").addClass("FeaturedFlag");

			// Gets active state
			var activeState = localStorage.getItem("PluginActive" + obj.Name);
			if (activeState === null) {
				localStorage.setItem("PluginActive" + obj.Name, "On");
				activeState = "On";
			}

			// Assigns that state to control
			if (activeState == "On") $("#PluginActive" + obj.Name).attr("checked", true);
			else $("#PluginActive" + obj.Name).attr("checked", false);

			// On click event
			$("#PluginActive" + obj.Name).button().click(function () {
				var currentState = $("#PluginActive" + obj.Name).attr("checked") == null ? "Off" : "On";
				$("#PluginActiveLabel" + obj.Name + " span").text(currentState == "On" ? "On" : "Off");
				$("#PluginImage" + obj.Name).attr("class", (currentState == "On" ? " " : "Disabled"));
				localStorage.setItem("PluginActive" + obj.Name, currentState);
			});

			// Activate initial control state
			$("#PluginActiveLabel" + obj.Name + " span").text(activeState == "On" ? "On" : "Off");
			$("#PluginImage" + obj.Name).attr("class", (activeState == "On" ? " " : "Disabled"));
		}
	);
});