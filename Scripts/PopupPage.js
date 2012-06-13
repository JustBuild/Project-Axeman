$(document).ready(function () {
	(new PopupPage()).Initialize();
});

function PopupPage() {

	this.Initialize = function () {
		$("#Plugins").click(function () {
			chrome.tabs.create({ url: Helpers.GetExtensionRootURL("Pages/PluginsManager.html"), active: true });
		});

		$("#ModalNewServerClose").click(function () {
			AddNewServer($("#NewServerAddress").val(), $("#NewServerUsername").val(), $("#NewServerUID").val());

			$("body").css("height", "auto");
			$("#Selection").show("slide", { direction: "left" }, 500);
			$("#ModalNewServer").hide("slide", { direction: "right" }, 500);
		});

		$("#AddNewServer").click(function () {
			$("body").css("height", "200px");
			$("#Selection").hide("slide", { direction: "left" }, 500);
			$("#ModalNewServer").show("slide", { direction: "right" }, 500);
		});

		$(".SectionItem").click(function () {
			chrome.tabs.create({ url: ("http://" + $(this).find(".AccountServer").text()), active: true });
		});

		this.RefreshServers();
	};

	this.AddNewServer = function(server, username, uid) {
		
	};

	this.RefreshServers = function() {
		var profiles = JSON.parse(localStorage["Profiles"]);
		console.log(profiles);
	};

	this.GetServers = function() {
		return JSON.parse(localStorage.getItem[""]);
	};
};