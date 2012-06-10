$(document).ready(function () {
	(new PopupPage()).Initialize();
});

function PopupPage() {

	this.Initialize = function () {
		$("#Plugins").click(function () {

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
	};

	this.AddNewServer = function(server, username, uid) {

	};

	this.RefreshServers = function() {

	};

	this.GetServers = function() {
		return JSON.parse(localStorage.getItem[""]);
	};
};