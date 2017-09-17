/******************************************************************************
 * AutoAdventure.js
 *
 * Author:
 *      Geczy
 *
 * Created on:
 *      13.07.2014.
 *
 *****************************************************************************/


function AutoAdventure() {
    /// <summary>
    /// Initializes object
    /// </summary>
    this.Register = function() {
        Log("Registering AutoAdventure plugin...", "AutoAdventure");

        this.initialize();
    },

    this.initialize = function() {
        if (!ActiveProfile.Hero.HasAdventure || !ActiveProfile.Hero.CanAdventure) {
            return;
        }
        // If we are not starting an adventure, lets start one
        if (!MatchQuery({t: 3}) && !MatchPages([Enums.TravianPages.HeroStartAdventure, Enums.TravianPages.HeroAdventures])) {
            location.href = 'hero.php?t=3';
            return;
        }

        // Pick the first adventure from the list
        if (MatchQuery({t: 3}) && MatchPages([Enums.TravianPages.HeroAdventures])) {
            var adventures = this.getAdventures();
            adventures = this.sortByDuration(adventures);

            console.log(adventures)
            var adventure = adventures.filter(':first').find('a.gotoAdventure');
            var url = adventure.attr('href');
            if (url != undefined) {
              location.href = url;
                return;
            }
        }
        // Start the first adventure
        if (MatchPages([Enums.TravianPages.HeroStartAdventure])) {
            var startButton = $('.adventureSend button.green');

          if (startButton.length) {
                startButton.click();
            }
        }

    }

    this.getAdventures = function() {
        return $('form#adventureListForm table tbody tr');
    }

    this.sortByDuration = function(adventures) {
        var moveTimes = adventures.find('.moveTime').slice(0);
        var swapped;
        do {
            swapped = false;
            for (var i=0; i < moveTimes.length-1; i++) {
                if (moveTimes[i].innerText > moveTimes[i+1].innerText) {
                    var temp = moveTimes[i];
                    moveTimes[i] = moveTimes[i+1];
                    moveTimes[i+1] = temp;
                    swapped = true;
                }
            }
        } while (swapped);
        return moveTimes.parent();
    }

    this.filterForNormalAdventures = function(adventures) {
        return adventures.find('.difficulty img[alt="normal"]').parent().parent();
    }

    this.filterForHardAdventures = function(adventures) {
        return adventures.find('td.difficulty img[alt="hard"]').parent().parent();
    }

}

// Metadata for this plugin (AutoAdventure)
var AutoAdventureMetadata = {
    Name: "AutoAdventure",
    Alias: "Auto Adventure",
    Category: "Utility",
    Version: "0.1.0.0",
    Description: "Completes an adventure when available.",
    Author: "Geczy",
    Site: "https://github.com/JustBuild/Project-Axeman/wiki",

    Settings: {
        IsLoginRequired: true,
    },

    Flags: {
        Alpha: true
    },

    Class: AutoAdventure
};

// Adds this plugin to global list of available plugins
GlobalPluginsList[GlobalPluginsList.length] = $.extend(true, {}, Models.PluginMetadata, AutoAdventureMetadata);
