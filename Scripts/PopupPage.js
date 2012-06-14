var popupPage;

$(document).ready(function () {
	popupPage = new PopupPage();
	popupPage.Initialize();
});

function PopupPage() {
	this.Initialize = function () {
		$("#Plugins").click(function () {
			chrome.tabs.create({ url: Helpers.GetExtensionRootURL("Pages/PluginsManager.html"), active: true });
		});

		$("#ModalNewProfileClose").click(function () {
			popupPage.AddNewProfile($("#NewServerAddress").val(), $("#NewProfileUsername").val(), $("#NewProfileUID").val());
			location.reload();

			$("body").css("height", "auto");
			$("#Selection").show("slide", { direction: "left" }, 500);
			$("#ModalNewProfile").hide("slide", { direction: "right" }, 500);
		});

		$("#AddNewProfile").click(function () {
			$("body").css("height", "200px");
			$("#Selection").hide("slide", { direction: "left" }, 500);
			$("#ModalNewProfile").show("slide", { direction: "right" }, 500);
		});

		this.RefreshProfiles();
	};

	this.AddNewProfile = function (Profile, username, uid) {
		Helpers.Log("PopupPage: Adding new user.");

		var profile = new Models.Profile();
		profile.Name = username;
		profile.UID = uid;
		profile.ServerAddress = Profile;

		Helpers.DLog("PopupPage: User created [" + profile + "]");

		var existingProfiles = this.GetProfiles();

		for (var index in existingProfiles) {
			if (existingProfiles[index].UID == uid) {
				Helpers.Warn("PopupPage: Profile already exists");
				return false;
			}
		}

		existingProfiles[existingProfiles.length] = profile;
		Helpers.DLog("PopupPage: New user added to array. New array [" + existingProfiles + "]");

		localStorage.setItem("Profiles", JSON.stringify(existingProfiles));
		Helpers.Log("PopupPage: New list saved.");
	};

	this.RefreshProfiles = function() {
		var profiles = this.GetProfiles();

		for (var index in profiles) {
			var profile = profiles[index];

			$("#ProfilesTable").prepend(this.GenerateView(profile));
		}
		
		$(".SectionItem").click(function () {
			chrome.tabs.create({ url: ("http://" + $(this).find(".AccountServer").text()), active: true });
		});
		
		$(".DeleteButton").click(function () {
			popupPage.RemoveProfile($(this).parents().find(".AccountUID").first().text());
			location.reload();
		});

		Helpers.Log("PopupPage: Profiles refreshed!");
	};

	this.RemoveProfile = function (uid) {
		var profiles = this.GetProfiles();
		var newProfiles = new Array();

		for (var index in profiles) {
			var profile = profiles[index];

			if (profile.UID != uid) {
				newProfiles[newProfiles.length] = profile;
			}
		}

		localStorage.setItem("Profiles", JSON.stringify(newProfiles));
	};

	this.GenerateView = function (profile) {
		if (profile == null) return "<tr><td>NoData</td></tr>";

		var source = 
			"<tr>\
				<td>\
					<table class='SectionItem' style='width:100%;'>\
						<tr>\
							<td style='width:64px'>\
								<div class='DeleteButton'>r</div>\
								<img id='Img2' src='http://" + profile.ServerAddress + "/hero_image.php?uid=" + profile.UID + "' width='64' height='73' />\
							</td>\
							<td>\
								<table style='width:100%'>\
									<tr>\
										<td>\
											<div>" + profile.Name + "</div>\
										</td>\
										<td>\
											<div class='AccountUID'>" + profile.UID + "</div>\
										</td>\
									</tr>\
									<tr>\
										<td colspan='2'>\
											<div class='AccountDetail' style='margin-top:10px'>" + profile.Villages.length + " village(s)</div>\
										</td>\
									</tr>\
									<tr>\
										<td colspan='2'>\
											<div class='AccountDetail' style='margin-bottom:10px'>" + profile.Population + " population</div>\
										</td>\
									</tr>\
									<tr>\
										<td colspan='2'>\
											<div class='AccountServer'>" + profile.ServerAddress + "</div>\
										</td>\
									</tr>\
								</table>\
							</td>\
						</tr>\
					</table>\
				</td>\
			</tr>";
		
		return source;
	};

	this.GetProfiles = function () {
		var profilesString = localStorage.getItem("Profiles");
		if (profilesString != null && profilesString.length > 0) {
			return JSON.parse(profilesString);
		}
		else return new Array();
	};
};