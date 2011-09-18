/*
 * ContentScript.js
 * 08.09.2011.
 * 
 * by Aleksandar Toplek,
 * JustBuild Development 2011.
 * 
 * Collaborator(s)
 *     Everton Moreth
 * 
 * License can be found in LICENSE.md file 
 * distributed with this file.
 * 
 */

/**
 * Enumerators
 */
var Enums = {
	VillageTypes: {
		f1: [3, 3, 3, 9],
		f2: [3, 4, 5, 6],
		f3: [4, 4, 4, 6],
		f4: [4, 5, 3, 6],
		f5: [5, 3, 4, 6],
		f6: [1, 1, 1, 15],
		f7: [4, 4, 3, 7],
		f8: [3, 4, 4, 7],
		f9: [4, 3, 4, 7],
		f10: [3, 5, 4, 6],
		f11: [4, 3, 5, 6],
		f12: [5, 4, 3, 6]
	},
	
	// lvl.: [wood, clay, iron, crop, consumption, time, culture points, production]
	Fields: {
		Wood: {
			lvl1: [40, 100, 50, 60, 2, 260, 1, 5],
			lvl2: [65, 165, 85, 100, 1, 620, 1, 9],
			lvl3: [110, 280, 140, 165, 1, 1190, 2, 15],
			lvl4: [185, 465, 235, 280, 1, 2100, 2, 22],
			lvl5: [310, 780, 390, 465, 2, 3560, 2, 22],
			lvl6: [520, 1300, 650, 780, 2, 5890, 3, 50],
			lvl7: [870, 2170, 1085, 1300, 2, 9620, 4, 70],
			lvl8: [1450, 3625, 1810, 2175, 2, 15590, 4, 100],
			lvl9: [2420, 6050, 3025, 3630, 2, 21729, 5, 145],
			lvl10: [4040, 10105, 5050, 6060, 2, 40440, 6, 200],
			lvl11: [6750, 16870, 8435, 10125, 2, 64900, 7, 280],
			lvl12: [11270, 28175, 14090, 16905, 2, 103510, 9, 375],
			lvl13: [18820, 47055, 23525, 28230, 2, 166680, 11, 495],
			lvl14: [31430, 78580, 39290, 47150, 2, 266880, 13, 635],
			lvl15: [52490, 131230, 65615, 78740, 2, 427210, 15, 800],
			lvl16: [87660, 219155, 109575, 131490, 3, 683730, 18, 1000],
			lvl17: [146395, 365985, 182995, 219590, 3, 1094170, 22, 1300],
			lvl18: [244480, 611195, 305600, 366715, 3, 1750880, 27, 1600],
			lvl19: [408280, 1020695, 510350, 612420, 3, 2801600, 32, 2000],
			lvl20: [681825, 1704565, 852280, 1022740, 3, 4482770, 38, 2450]
		},
		Clay: {
			lvl1: [0, 0, 0, 0, 0, 0, 0, 0],
			lvl2: [0, 0, 0, 0, 0, 0, 0, 0],
			lvl3: [0, 0, 0, 0, 0, 0, 0, 0],
			lvl4: [0, 0, 0, 0, 0, 0, 0, 0],
			lvl5: [0, 0, 0, 0, 0, 0, 0, 0],
			lvl6: [0, 0, 0, 0, 0, 0, 0, 0],
			lvl7: [0, 0, 0, 0, 0, 0, 0, 0],
			lvl8: [0, 0, 0, 0, 0, 0, 0, 0],
			lvl9: [0, 0, 0, 0, 0, 0, 0, 0],
			lvl10: [0, 0, 0, 0, 0, 0, 0, 0],
			lvl11: [0, 0, 0, 0, 0, 0, 0, 0],
			lvl12: [0, 0, 0, 0, 0, 0, 0, 0],
			lvl13: [0, 0, 0, 0, 0, 0, 0, 0],
			lvl14: [0, 0, 0, 0, 0, 0, 0, 0],
			lvl15: [0, 0, 0, 0, 0, 0, 0, 0],
			lvl16: [0, 0, 0, 0, 0, 0, 0, 0],
			lvl17: [0, 0, 0, 0, 0, 0, 0, 0],
			lvl18: [0, 0, 0, 0, 0, 0, 0, 0],
			lvl19: [0, 0, 0, 0, 0, 0, 0, 0],
			lvl20: [0, 0, 0, 0, 0, 0, 0, 0]
		},
		Iron: {
			lvl1: [0, 0, 0, 0, 0, 0, 0, 0],
			lvl2: [0, 0, 0, 0, 0, 0, 0, 0],
			lvl3: [0, 0, 0, 0, 0, 0, 0, 0],
			lvl4: [0, 0, 0, 0, 0, 0, 0, 0],
			lvl5: [0, 0, 0, 0, 0, 0, 0, 0],
			lvl6: [0, 0, 0, 0, 0, 0, 0, 0],
			lvl7: [0, 0, 0, 0, 0, 0, 0, 0],
			lvl8: [0, 0, 0, 0, 0, 0, 0, 0],
			lvl9: [0, 0, 0, 0, 0, 0, 0, 0],
			lvl10: [0, 0, 0, 0, 0, 0, 0, 0],
			lvl11: [0, 0, 0, 0, 0, 0, 0, 0],
			lvl12: [0, 0, 0, 0, 0, 0, 0, 0],
			lvl13: [0, 0, 0, 0, 0, 0, 0, 0],
			lvl14: [0, 0, 0, 0, 0, 0, 0, 0],
			lvl15: [0, 0, 0, 0, 0, 0, 0, 0],
			lvl16: [0, 0, 0, 0, 0, 0, 0, 0],
			lvl17: [0, 0, 0, 0, 0, 0, 0, 0],
			lvl18: [0, 0, 0, 0, 0, 0, 0, 0],
			lvl19: [0, 0, 0, 0, 0, 0, 0, 0],
			lvl20: [0, 0, 0, 0, 0, 0, 0, 0]
		},
		Crop: {
			lvl1: [0, 0, 0, 0, 0, 0, 0, 0],
			lvl2: [0, 0, 0, 0, 0, 0, 0, 0],
			lvl3: [0, 0, 0, 0, 0, 0, 0, 0],
			lvl4: [0, 0, 0, 0, 0, 0, 0, 0],
			lvl5: [0, 0, 0, 0, 0, 0, 0, 0],
			lvl6: [0, 0, 0, 0, 0, 0, 0, 0],
			lvl7: [0, 0, 0, 0, 0, 0, 0, 0],
			lvl8: [0, 0, 0, 0, 0, 0, 0, 0],
			lvl9: [0, 0, 0, 0, 0, 0, 0, 0],
			lvl10: [0, 0, 0, 0, 0, 0, 0, 0],
			lvl11: [0, 0, 0, 0, 0, 0, 0, 0],
			lvl12: [0, 0, 0, 0, 0, 0, 0, 0],
			lvl13: [0, 0, 0, 0, 0, 0, 0, 0],
			lvl14: [0, 0, 0, 0, 0, 0, 0, 0],
			lvl15: [0, 0, 0, 0, 0, 0, 0, 0],
			lvl16: [0, 0, 0, 0, 0, 0, 0, 0],
			lvl17: [0, 0, 0, 0, 0, 0, 0, 0],
			lvl18: [0, 0, 0, 0, 0, 0, 0, 0],
			lvl19: [0, 0, 0, 0, 0, 0, 0, 0],
			lvl20: [0, 0, 0, 0, 0, 0, 0, 0]
		}
	},
	
	Buildings: {
		// http://t4.answers.travian.com/index.php?aid=46#go2answer
		TownHall: {
			Cost: {
				lvl1: [0, 0, 0, 0, 0, 0, 0],
				lvl2: [0, 0, 0, 0, 0, 0, 0],
				lvl3: [0, 0, 0, 0, 0, 0, 0],
				lvl4: [0, 0, 0, 0, 0, 0, 0],
				lvl5: [0, 0, 0, 0, 0, 0, 0],
				lvl6: [0, 0, 0, 0, 0, 0, 0],
				lvl7: [0, 0, 0, 0, 0, 0, 0],
				lvl8: [0, 0, 0, 0, 0, 0, 0],
				lvl9: [0, 0, 0, 0, 0, 0, 0],
				lvl10: [0, 0, 0, 0, 0, 0, 0],
				lvl11: [0, 0, 0, 0, 0, 0, 0],
				lvl12: [0, 0, 0, 0, 0, 0, 0],
				lvl13: [0, 0, 0, 0, 0, 0, 0],
				lvl14: [0, 0, 0, 0, 0, 0, 0],
				lvl15: [0, 0, 0, 0, 0, 0, 0],
				lvl16: [0, 0, 0, 0, 0, 0, 0],
				lvl17: [0, 0, 0, 0, 0, 0, 0],
				lvl18: [0, 0, 0, 0, 0, 0, 0],
				lvl19: [0, 0, 0, 0, 0, 0, 0],
				lvl20: [0, 0, 0, 0, 0, 0, 0]
			},
			Celebrations: {
				Cost: {
					small: [6400, 6650, 5940, 1340, 500, 250],
					great: [2970, 33250, 32000, 6700, 2000, 1000]
				},
				Duration: {
					lvl1: [0, 0, 0, 0],
					lvl2: [0, 0, 0, 0],
					lvl3: [0, 0, 0, 0],
					lvl4: [0, 0, 0, 0],
					lvl5: [0, 0, 0, 0],
					lvl6: [0, 0, 0, 0],
					lvl7: [0, 0, 0, 0],
					lvl8: [0, 0, 0, 0],
					lvl9: [0, 0, 0, 0],
					lvl10: [0, 0, 0, 0],
					lvl11: [0, 0, 0, 0],
					lvl12: [0, 0, 0, 0],
					lvl13: [0, 0, 0, 0],
					lvl14: [0, 0, 0, 0],
					lvl15: [0, 0, 0, 0],
					lvl16: [0, 0, 0, 0],
					lvl17: [0, 0, 0, 0],
					lvl18: [0, 0, 0, 0],
					lvl19: [0, 0, 0, 0],
					lvl20: [0, 0, 0, 0]
				}
			}
		},
	
		// http://t4.answers.travian.com/index.php?aid=19#go2answer
		StonemasonsLodge: {
			lvl1: [0, 0, 0, 0, 0, 0, 0, 0],
			lvl2: [0, 0, 0, 0, 0, 0, 0, 0],
			lvl3: [0, 0, 0, 0, 0, 0, 0, 0],
			lvl4: [0, 0, 0, 0, 0, 0, 0, 0],
			lvl5: [0, 0, 0, 0, 0, 0, 0, 0],
			lvl6: [0, 0, 0, 0, 0, 0, 0, 0],
			lvl7: [0, 0, 0, 0, 0, 0, 0, 0],
			lvl8: [0, 0, 0, 0, 0, 0, 0, 0],
			lvl9: [0, 0, 0, 0, 0, 0, 0, 0],
			lvl10: [0, 0, 0, 0, 0, 0, 0, 0],
			lvl11: [0, 0, 0, 0, 0, 0, 0, 0],
			lvl12: [0, 0, 0, 0, 0, 0, 0, 0],
			lvl13: [0, 0, 0, 0, 0, 0, 0, 0],
			lvl14: [0, 0, 0, 0, 0, 0, 0, 0],
			lvl15: [0, 0, 0, 0, 0, 0, 0, 0],
			lvl16: [0, 0, 0, 0, 0, 0, 0, 0],
			lvl17: [0, 0, 0, 0, 0, 0, 0, 0],
			lvl18: [0, 0, 0, 0, 0, 0, 0, 0],
			lvl19: [0, 0, 0, 0, 0, 0, 0, 0],
			lvl20: [0, 0, 0, 0, 0, 0, 0, 0]
		},
		
		// http://t4.answers.travian.com/index.php?aid=50#go2answer
		Treasury: {
			lvl1: [0, 0, 0, 0, 0, 0, 0],
			lvl2: [0, 0, 0, 0, 0, 0, 0],
			lvl3: [0, 0, 0, 0, 0, 0, 0],
			lvl4: [0, 0, 0, 0, 0, 0, 0],
			lvl5: [0, 0, 0, 0, 0, 0, 0],
			lvl6: [0, 0, 0, 0, 0, 0, 0],
			lvl7: [0, 0, 0, 0, 0, 0, 0],
			lvl8: [0, 0, 0, 0, 0, 0, 0],
			lvl9: [0, 0, 0, 0, 0, 0, 0],
			lvl10: [0, 0, 0, 0, 0, 0, 0],
			lvl11: [0, 0, 0, 0, 0, 0, 0],
			lvl12: [0, 0, 0, 0, 0, 0, 0],
			lvl13: [0, 0, 0, 0, 0, 0, 0],
			lvl14: [0, 0, 0, 0, 0, 0, 0],
			lvl15: [0, 0, 0, 0, 0, 0, 0],
			lvl16: [0, 0, 0, 0, 0, 0, 0],
			lvl17: [0, 0, 0, 0, 0, 0, 0],
			lvl18: [0, 0, 0, 0, 0, 0, 0],
			lvl19: [0, 0, 0, 0, 0, 0, 0],
			lvl20: [0, 0, 0, 0, 0, 0, 0]
		},
		
		// http://t4.answers.travian.com/index.php?aid=73#go2answer
		// WW: { }
		
		// http://t4.answers.travian.com/index.php?aid=15#go2answer
		MainBuilding: {
			lvl1: [0, 0, 0, 0, 0, 0, 0, 0],
			lvl2: [0, 0, 0, 0, 0, 0, 0, 0],
			lvl3: [0, 0, 0, 0, 0, 0, 0, 0],
			lvl4: [0, 0, 0, 0, 0, 0, 0, 0],
			lvl5: [0, 0, 0, 0, 0, 0, 0, 0],
			lvl6: [0, 0, 0, 0, 0, 0, 0, 0],
			lvl7: [0, 0, 0, 0, 0, 0, 0, 0],
			lvl8: [0, 0, 0, 0, 0, 0, 0, 0],
			lvl9: [0, 0, 0, 0, 0, 0, 0, 0],
			lvl10: [0, 0, 0, 0, 0, 0, 0, 0],
			lvl11: [0, 0, 0, 0, 0, 0, 0, 0],
			lvl12: [0, 0, 0, 0, 0, 0, 0, 0],
			lvl13: [0, 0, 0, 0, 0, 0, 0, 0],
			lvl14: [0, 0, 0, 0, 0, 0, 0, 0],
			lvl15: [0, 0, 0, 0, 0, 0, 0, 0],
			lvl16: [0, 0, 0, 0, 0, 0, 0, 0],
			lvl17: [0, 0, 0, 0, 0, 0, 0, 0],
			lvl18: [0, 0, 0, 0, 0, 0, 0, 0],
			lvl19: [0, 0, 0, 0, 0, 0, 0, 0],
			lvl20: [0, 0, 0, 0, 0, 0, 0, 0]
		},
		
		// http://t4.answers.travian.com/index.php?aid=11#go2answer
		Cranny: {
			lvl1: [0, 0, 0, 0, 0, 0, 0, 0],
			lvl2: [0, 0, 0, 0, 0, 0, 0, 0],
			lvl3: [0, 0, 0, 0, 0, 0, 0, 0],
			lvl4: [0, 0, 0, 0, 0, 0, 0, 0],
			lvl5: [0, 0, 0, 0, 0, 0, 0, 0],
			lvl6: [0, 0, 0, 0, 0, 0, 0, 0],
			lvl7: [0, 0, 0, 0, 0, 0, 0, 0],
			lvl8: [0, 0, 0, 0, 0, 0, 0, 0],
			lvl9: [0, 0, 0, 0, 0, 0, 0, 0],
			lvl10: [0, 0, 0, 0, 0, 0, 0, 0]
		}//,
		
		// http://t4.answers.travian.com/index.php?aid=4#go2answer
		//Embassy: { },
		
		// http://t4.answers.travian.com/index.php?aid=17#go2answer
		//Palace: { },
		
		// http://t4.answers.travian.com/index.php?aid=18#go2answer
		//Residence: { },
		
		// http://t4.answers.travian.com/index.php?aid=16#go2answer
		//Marketplace: { },
		
		// http://t4.answers.travian.com/index.php?aid=48#go2answer
		//TradeOffice: { },
	}
};

 /**
  * Village model class
  *
  * @author Aleksandar Toplek
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
