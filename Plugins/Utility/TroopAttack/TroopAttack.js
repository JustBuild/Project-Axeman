/******************************************************************************
 * TroopAttack.js
 *
 * Author:
 * 		Geczy
 *
 * Created on:
 * 		26.02.2015.
 *
 *****************************************************************************/


function TroopAttack() {
	/// <summary>
	/// Initializes object
	/// </summary>
	this.Register = function () {
		Log("Registering TroopAttack plugin...", "TroopAttack");

		// Show carrying capacity
		TroopCarryCapacity();
	};

	var TroopCarryCapacity = function () {
		/// <summary>
		/// Shows the carrying capacity of troops entered in rally point attack
		/// </summary>

		Log("Adding 'Check all' option to reports and messages", "TroopAttack");

		$('#content').append('<div class="TroopAttack"><div id="capacity"></div></div>')

		$('#troops input').change(function(e) {
			recalculateCapacity();
		});

		function recalculateCapacity() {
			var totalCapacity = 0;
			$('#troops input').each(function(i) {
				var val = $(this).val();
				if(!val) return true;

				var txt = $(this).attr('name');
	            var m = new RegExp('.*?' + '(\\d+)', ["i"]).exec(txt);

	            if (m == null) {
	                return true;
	            }

	            var uid = m[1];
	            var capacity = Enums.TroopResources[uid][6];
	            if (capacity) {
	            	totalCapacity += capacity * val;
	            	$('.TroopAttack #capacity').html("Total carrying capacity: " + NumberWithCommas(totalCapacity));
	        	}
			});
		}

		Log("Adding 'Check all' option successfully added", "TroopAttack");
	};
}

// Metadata for this plugin (TroopAttack)
var TroopAttackMetadata = {
	Name: "TroopAttack",
	Alias: "Troop Attack",
	Category: "Utility",
	Version: "0.0.0.1",
	Description: "TODO",
	Author: "Geczy",
	Site: "https://github.com/JustBuild/Project-Axeman/wiki",

	Settings: {
		IsLoginRequired: true,
		RunOnPages: [ Enums.TravianPages.Build ],
		PageMayContain: [	"#troops"]
	},

	Flags: {
		Alpha: true,
		Internal: true
	},

	Class: TroopAttack
};

// Adds this plugin to global list of available plugins
GlobalPluginsList[GlobalPluginsList.length] = $.extend(true, {}, Models.PluginMetadata, TroopAttackMetadata);