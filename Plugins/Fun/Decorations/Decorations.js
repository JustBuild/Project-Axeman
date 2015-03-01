/******************************************************************************
 * Decorations.js
 *
 * Author:
 * 		Aleksandar Toplek
 *
 * Created on:
 * 		13.01.2013.
 *
 *****************************************************************************/


function Decorations() {
	/// <summary>
	/// Initializes object
	/// </summary>
	this.Register = function() {
		Log("Registering Decorations plugin...", "Decorations");

		RemoveInGameHelp();
		EasyDemolish();
		AddPlusLinks();

		$('.openedClosedSwitch.switchClosed').on('click', function(e) {
			AddCoordsToFarmList();
		});

		AddCoordsToFarmList();

		var commaClasses = [
			".rArea",
			".carry",
			".val.lc",
		];

		for (var i in commaClasses) {
			AddCommas(commaClasses[i]);
		}
	};

	var AddPlusLinks = function() {
		if (!$('.layoutButton.marketBlack.gold').length) {
			return false;
		}

		var replaceClasses = [
			"workshop",
			"stable",
			"barracks",
			"market",
		];

		var ids = [
			21,
			20,
			19,
			17,
		];

		$('.layoutButton.gold:not(.editBlack)').each(function( i ) {
			if ($(this).hasClass(replaceClasses[i] + "Black")) {
				$(this).removeClass(replaceClasses[i] + "Black gold").addClass(replaceClasses[i] + "White green");
				$(this).off('click hover');
				$(this).attr('onclick', 'location.href="' + Enums.TravianPages.Build + '?gid=' + ids[i] + '"');
			}
		});

	}

	var EasyDemolish = function() {
		if (!$('#demolish').length) {
			return false;
		}

		$('#demolish option').each(function(index) {
			$(this).text($(this).text().replace($(this).val() + '.', ''));
		});

		$("#demolish").append($("#demolish option").remove().sort(function(a, b) {
			var at = $(a).text(),
				bt = $(b).text();
			return (at > bt) ? 1 : ((at < bt) ? -1 : 0);
		}));
	}

	var AddCoordsToFarmList = function() {
		$('.village').each(function(i) {
			if ($(this).find('.coordDecoration').length) {
				return true;
			}

			coords = SplitURL($(this).find('a').attr('href'));

			if (!coords["x"]) {
				return true;
			}

			var html = '';
			html += '<span class="coordDecoration">' + coords["x"] + '|' + coords["y"] + '</span>';

			$(this).prepend(html);
		});
	}

	var RemoveInGameHelp = function() {
		/// <summary>
		/// Removes in game help link from every travian page.
		/// On some servers this will not remove stone and book since they are
		/// on one static image, it will only remove question mark and link.
		/// </summary>

		Log("Removing in game help...", "Decorations");
		$("#ingameManual").remove();
		Log("In game help removed!", "Decorations");
	};

	var AddCommas = function(commaClass) {
		if ($(commaClass).length) {
			$(commaClass).each(function(index) {
				$(this).html($(this).html().replace($(this).text(), NumberWithCommas($(this).text())));
			});
		}
	};
}

// Metadata for this plugin (Decorations)
var DecorationsMetadata = {
	Name: "Decorations",
	Alias: "Decorations",
	Category: "Fun",
	Version: "0.0.1.0",
	Description: "Removes in game help link, adds grouped numbers into statistics and numberes alliance members",
	Author: "JustBuild Development",
	Site: "https://github.com/JustBuild/Project-Axeman/wiki",

	Flags: {
		Beta: true
	},

	Class: Decorations
};

// Adds this plugin to global list of available plugins
GlobalPluginsList[GlobalPluginsList.length] = $.extend(true, {}, Models.PluginMetadata, DecorationsMetadata);