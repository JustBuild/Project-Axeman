/*
 * Models.js
 *
 * Author:
 *		Aleksandar Toplek
 *
 * Created on:
 *		25.02.2012.
 *
 */

 // TODO: Remove Models.js
 // NOTE: All models goese to its "namespace"

// Definitions
var Models = {
	"Village": 		Village,
	"Profile": 		Profile
};


/*
 * Village model
 */
function Village() {
	// Note: On any *.travian.*/... page (except help)
	this.name = "<NameNotDefined>";
	this.loyalty = 100;
	
	// Note: On spieler.php?uid=* page where * is players id
	this.isMainCity = false;
	this.population = 0;
	this.Position = {
		x: 0,
		y: 0
	};
	
	// Note: On any *.travian.*/... page (except help)
	this.Resources = {
		lastUpdated: 0,
		
		storage: [0, 0],
		stored: [0, 0, 0, 0],
		
		production: [0, 0, 0, 0],
		
		totalCropProduction: 0,
		cosumption: 0
	};
	
	// Note: On dorf1.php page
	this.VillageIn = {
		lastUpdated: 0,
		
		levels: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		buildings: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
	};
	
	// NOTE: On dorf1.php page
	this.VillageOut = {
		lastUpdated: 0,

		type: "f3",
		levels: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
	};
	
	this.Troops = {
		// NOTE: On build.php?id=39 (since rally point is on the same place in every village)
		//       EXCEPT WW village
		// This is players troops currently in village that can be sent to attack/support
		AvailableTroops: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		
		// NOTE: On build.php?id=39 (since rally point is on the same place in every village)
		// This is total troops in village (supports + players troops + troops in attack/support/return/adventure)
		TotalTroops: {
			gauls: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			romans: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			teutons: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			nature: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
		},
		
		// NOTE: build.php page > gid13 (Armory)
		TroopLevels: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0] 
	};
}

/*
 * Profile model
 */
 function Profile() {
 	this.isDefault = false;
	this.profileName = "Default";
 }