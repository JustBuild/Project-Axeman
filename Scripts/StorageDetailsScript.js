$(document).ready(function () {
	(new StorageDetails()).Initialize();
});

function StorageDetails() {
	this.Initialize = function () {
		// Clears localStorage and reloads page
		$("#ClearLocalStorage").click(function () { localStorage.clear(); location.reload(); });

		if (localStorage.length != 0) {
			// Hides No Data sign
			$("#NoDataSign").attr("style", "visibility:hidden;");

			var root = $("#LocalStorageTree");
			// Populates browser
			for (var index = 0; index < localStorage.length; ++index) {
				var item = $("<li></li>");
				item.append("<span>" + localStorage.key(index) + " <i>(" + typeof(localStorage[localStorage.key(index)]) + ")</i>:\t\"" + localStorage[localStorage.key(index)] + "\"</span>");

				root.append(item);
			}
		}
	};
};