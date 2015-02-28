// TODO Add support for editing password/profile

var popupPage;

$(document).ready(function () {
	popupPage = new PopupPage();
	popupPage.Initialize();

	// Initialize GA
	var _gaq = _gaq || [];
	_gaq.push(['_setAccount', 'UA-33221456-3']);
	_gaq.push(['_trackPageview']);

	(function () {
		var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
		ga.src = ('https:' == document.location.protocol ? 'https://' : 'http://') + 'stats.g.doubleclick.net/dc.js';
		var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
	})();
});

function PopupPage() {
	var modalAnimationSpeed = 500;
	var isModalActive = false;


	this.Initialize = function () {
		$("#Plugins").attr("href", GetURL("Pages/Options/Options.html"));

		InitializeActiveButton();
		InitializeModal();
		RefreshProfiles();
		
		_localize($("body"));
	};

	var InitializeActiveButton = function() {
		$(".ExtensionActiveContainer").click(function() {
			SetExtensionActiveState($(this).hasClass("Inactive"));
		});
		
		// Load and set extension active set
		var state = ExtensionActive();
		SetExtensionActiveState(state ? true : state.State);
	};
	
	var SetExtensionActiveState = function (isActive) {
		if (isActive) {
			$(".ExtensionActiveContainer").removeClass("Inactive");
			$(".ExtensionActiveMessage").text(_gim("popup_ExtensionActive"));
			ExtensionActive(true);
		} else {
			$(".ExtensionActiveContainer").addClass("Inactive");
			$(".ExtensionActiveMessage").text(_gim("popup_ExtensionInactive"));
			ExtensionActive(false);
		}
	};

	var InitializeModal = function() {
		// Handle for modal view
		$(document).on('click keyup', function (e) {
			// If this is a keyup event, let's see if it's an ESC key
			if (e.type == "keyup" && e.keyCode != 27) return;

			HideModalView();
		});

		// Activate modal view on "Add" button click
		$("#AddNewProfile").click(function () {
			$.pageslide({
				direction: "left",
				href: "PopupAddUser.html",
				iframe: false,
				speed: modalAnimationSpeed,
				modal: true,
				moveBody: false,
				onLoaded: function() {
					console.log("Localizing...");
					_localize($("#pageslide"));
				}
			});
			
			setTimeout(function () {
				isModalActive = true;

				$("#AddNewProfileSubmit").click(function () {
					AddNewProfile();
					HideModalView(true);
				});
			}, modalAnimationSpeed);
			
			$(".ModalViewCover").fadeToggle();

			_localize($("#pageslide"));
		});
	};

	var HideModalView = function (reload) {
		// TODO Comment
		
		if (!isModalActive) {
			console.log("Modal is already hidden!");
			return;
		}

		// Initiates modal close and reloads page when modal is closed
		$.pageslide.close();
		setTimeout(function () {
			if (reload) location.reload();
			isModalActive = false;
		}, modalAnimationSpeed);

		$(".ModalViewCover").fadeToggle();
	};

	var AddNewProfile = function () {
		// TODO Comment

		console.log("Adding new user.");

		// Create profile and populate fields
		var profile = new Models.Profile();
		profile.Name = $("#AddUserUserName").val();
		profile.ServerAddress = $("#AddUserServer").val();
		profile.Password = $("#AddUserPassword").val();
		profile.IsAutoLogin = $("#AddUserAutoLogin").val() == "on" && !IsNullOrEmpty(profile.Password);

		console.log("User created");
		console.log(profile);

		// Check if that profile (Server + UID) 
		// already exists if so return
		var existingProfiles = GetProfiles();
		for (var index in existingProfiles) {
			if (existingProfiles[index].ServerAddress == profile.ServerAddress &&
				existingProfiles[index].Name == profile.Name) {
				console.warn("Profile already exists");
				return false;
			}
		}

		// Insert profile to list
		existingProfiles[existingProfiles.length] = profile;
		console.log("New user added to array. New array");
		console.log(existingProfiles);

		// Update list in storage
		UpdateProfiles(existingProfiles);
		console.log("New list saved.");
	};

	var RefreshProfiles = function () {
		// TODO Comment

		// Get a list of available profiles
		var profiles = GetProfiles();
		
		// Checks if and profile is available
		if (profiles.length) {
			$("#ProfilesList .Info").hide();
		}

		// Generates and prepends all profiles from list
		for (var index = 0, cache = profiles.length; index < cache; index++) {
			$("#ProfilesList").append(GetProfileView(profiles[index]));
		}
		
		// Open new tab on profile click
		$(".Profile").click(function (e) {
			if (!$(e.target).hasClass("DeleteButton")) {
				chrome.tabs.create({
					url: ("http://" + $(".ProfileDetails.Server", this).text()),
					active: true
				});
			} else {
				// Remove profile from list on click and 
				// reloads page to get list without deleted profile
				
				var server = $(".ProfileDetails.Server", this).first().text();
				var uid = $(".ProfileDetails.UID", this).first().text();
				var username = $(".ProfileDetails.UserName").first().text();

				RemoveProfile(server, uid, username);
				location.reload();
			}
		});

		console.log("Profiles refreshed!");
	};

	var RemoveProfile = function (server, uid, username) {
		// TODO Comment

		console.log("Profile remove requested for [" + server + "](" + uid + ")", "PopupPage");

		// Get a list of available profiles
		var profiles = GetProfiles();

		// Go through all available profiles and check if that profile is 
		// matching with given parameters (server and UID), in that case remove it
		for (var index = 0, cache = profiles.length; index < cache; index++) {
			var profile = profiles[index];
			if (server.indexOf(profile.ServerAddress) !== -1 &&
				(profile.UID == "unknown" && profile.Name == username) ||
				profile.UID == uid) {
				console.log("Profile (" + index + ") removed [" + profiles[index].server + "](" + profiles[index].UID + ")", "PopupPage");

				profiles.splice(index, 1);
				
				break;
			}
		}

		// Update changed profiles list
		UpdateProfiles(profiles);
	};

	var GetProfileView = function (profile) {
		// TODO Comment

		if (!profile) return "<div>Invalid profile data</div>";

		// Create left container elements
		var deleteButton = $("<div>").addClass("ProfileDetails DeleteButton").append('r');
		var profileImage = $("<img>").addClass("ProfileDetails Image").attr({
			src: profile.UID == "unknown" ?
				GetURL("Images/pa.png") :
				"http://" + profile.ServerAddress + "/hero_image.php?uid=" + profile.UID,
			width: 64, height: 64
		});
		var leftContainer = $("<div>").addClass("LeftContainer")
			.append(deleteButton)
			.append(profileImage);

		// Create right container elements
		var title = $("<div>")
			.append($("<div>").addClass("ProfileDetails UserName").append(profile.Name))
			.append($("<div>").addClass("ProfileDetails UID").append(profile.UID).attr("title", _gim("popup_ProfileItem_TitleUID")));
		// Calculate total player population
		var totalPopulation = 0;
		for (var index = 0; index < profile.Villages.length; index++) {
			totalPopulation += profile.Villages[index].Population;
		}
		var villages = $("<div>").addClass("ProfileDetails Village")
			.append($("<div>").addClass("ProfileDetails").append(profile.Villages.length + " " + _gim("popup_ProfileItem_Villages")))
			.append($("<div>").addClass("ProfileDetails").append(totalPopulation + " " + _gim("popup_ProfileItem_Population")));
		var serverDetails = $("<div>").addClass("ProfileDetails Server").append(profile.ServerAddress);
		var rightContainer = $("<div>").addClass("RightContainer")
			.append(title)
			.append(villages)
			.append(serverDetails);

		// Append containers
		var profileView = $("<div>").addClass("Profile");
		profileView.append(leftContainer);
		profileView.append(rightContainer);

		return profileView;
	};

	var UpdateProfiles = function(value) {
		localStorage.setItem("Profiles", JSON.stringify(value));
	};

	var GetProfiles = function () {
		// Dont use requests, this is faster
		// This is not ContentScript so there is no need to use Requests
		var profilesString = localStorage.getItem("Profiles");
		if (profilesString != null && profilesString.length > 0) {
			var profiles = JSON.parse(profilesString);
			console.log(profiles);
			return profiles;
		}
		else return new Array();
	};

	var ExtensionActive = function (state) {
		var settings = JSON.parse(localStorage.getItem("Settings")) || new Models.OptionsModel();
		
		if (state === undefined) {
			return settings.IsExtensionEnabled;
		} else {
			settings.IsExtensionEnabled = state;
			return localStorage.setItem("Settings", JSON.stringify(settings));
		}
	};
};