/******************************************************************************
 * App.js
 * 
 * Author:
 * 		Aleksandar Toplek,
 *
 * Created on:
 * 		25.02.2012.
 *
 ******************************************************************************/

function App() {
  /// <summary>
  /// App class
  /// This is start class for content script
  /// </summary>

  var self = this;
  var loadNumber = 0;
  var currentLoad = 0;
  var pluginsManager = new PluginsManager();
  var modalViewAnimationLength = 500;
  var isExtensionActive = true;

  this.Initialize = function() {
    /// <summary>
    /// Initializes App object
    /// </summary>

    // Initiates loading
    this.Load();
  };

  this.Load = function() {
    /// <summary>
    /// Loads all variables needed for further initialization
    /// </summary>

    console.log("App: Loading...");

    // Loading available user profiles
    loadNumber++;
    LoadProfiles();

    // Load extension active state
    loadNumber++;
    new Request("Background", "Data", "Settings", {
      Type: "get"
    }).Send(function(response) {
      if (response) {
        Settings = response;
        isExtensionActive = Settings.IsExtensionEnabled;
      }
      CheckFinishedLoading();
    });
  };

  var LoadProfiles = function() {
    /// <summary>
    /// Sends request and loads available user profiles
    /// </summary>

    console.log("App: Requesting profiles list...");

    var profilesRequest = new Request("Background", "Data", "Profiles", {
      Type: "get"
    });
    profilesRequest.Send(function(response) {
      // Check if response is valid
      if (IsNullOrEmpty(response)) {
        console.log("App: No profiles found...");
        console.log("App: Creating new profiles list...");

        AvailableProfiles = new Array();
      } else {
        // Parse response
        AvailableProfiles = response || new Array();

        console.log(
          "App: Recieved [" + AvailableProfiles.length + "] profile(s)"
        );
      }

      // Calls for loading finished for this request
      CheckFinishedLoading();
    });
  };

  var CheckFinishedLoading = function() {
    /// <summary>
    /// Increments number of current loads and checks if it is equal
    /// to needed loads, if so calls initialization finalization
    /// </summary>

    console.log(
      "App: Loaded [" + (currentLoad + 1) + " of " + loadNumber + "]"
    );

    if (++currentLoad >= loadNumber) {
      // If loading finished, finalize initialization
      InitializationFinalize();
    }
  };

  var InitializationFinalize = function() {
    /// <summary>
    /// Finazlizes initialization process
    /// </summary>

    if (isExtensionActive) {
      Log("App: Initialization started...");

      // Disables browser caching of ajax calls so that changes made on
      // plugins manager page are available on next restart
      $.ajaxSetup({ cache: false });

      // Initialize Modal View
      self.InitializeModalView();
      self.isModalViewActive = false;

      // Get active page
      self.GetActivePage();

      // Register plugins
      pluginsManager.Initialize();
    } else {
      Log("Extension is set to Disabled by user");
    }
  };

  this.GetActivePage = function() {
    /// <summary>
    /// Gets pathnames of current page and saves it to variables
    /// </summary>

    Log("App: Reading current page...");

    var currentAddress = window.location.hostname;
    var currentPath = window.location.pathname.replace("//", "/");
    var currentQuery = window.location.search;

    DLog("App: Current page address [" + currentAddress + "]");
    DLog("App: Current page pathname [" + currentPath + "]");
    DLog("App: Current page query [" + currentQuery + "]");

    ActiveServerAddress = currentAddress;
    ActivePage = GetKeyByValue(Enums.TravianPages, currentPath);
    ActivePageQuery = currentQuery;
  };

  this.InitializeModalView = function() {
    /// <summary>
    /// Initializes Moval View
    /// This function will inject modalview <div> tag onto page. This will
    /// be used to slide in/out pages so that user can change settings
    /// or see some additional information.
    /// </summary>

    Log("Initializing ModalView", "App");

    // Attach function to click and keyup events
    // so that we close modalview when user clicks
    // outside of modalview (on document not on modalview)
    $(document).on("click keyup", function(e) {
      // If this is a keyup event, let's see if it's an ESC key
      if (e.type == "keyup" && e.keyCode != 27) return;

      // Make sure it's visible, and we're not modal
      app.HideModalView();
    });

    Log("ModalView initialized", "App");
  };

  this.ShowModalView = function(page) {
    /// <summary>
    /// Slides in ModalView if it is hidden and shows given content on it
    /// </summary>
    /// <param name="page">Page to show in modal view</param>
    /// <returns>Returns true if modalview is successfully shown</returns>

    // Return if modelview is already active
    if (app.isModalViewActive == true) {
      //DLog("Modal already oppened!", "App");
      return false;
    }

    DLog("Opening ModalView...", "App");

    // Slide modal view in
    $.pageslide({
      direction: "left",
      href: GetURL(page),
      iframe: false,
      speed: modalViewAnimationLength,
      modal: true
    });

    // Selay setting modal view to shown for length of animation
    setTimeout(function() {
      app.isModalViewActive = true;
      DLog("ModalView shown", "App");
    }, modalViewAnimationLength);

    return true;
  };

  this.HideModalView = function() {
    /// <summary>
    /// Slides out ModalView if it is shown
    /// </summary>
    /// <returns>Returns true if modalview is successfully hidden</returns>

    // Return if modalview is already hidden
    if (app.isModalViewActive == false) {
      DLog("Modal already hidden!", "App");
      return false;
    }

    // Slide modal view away
    $.pageslide.close();

    // Delay setting modal view to hidden for length of animation
    setTimeout(function() {
      app.isModalViewActive = false;
      DLog("ModalView hidden", "App");
    }, modalViewAnimationLength);

    return true;
  };
}
