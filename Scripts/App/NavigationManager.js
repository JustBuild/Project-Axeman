function NavigationManager() {
  // TODO Check if app is idle then initiate gotopagewtimeout
  // TODO Navigation task list using Enums.TravianPages

  this.Initialize = function() {};

  this.GoToURLInTimeout = function(url, timeout) {
    /// <summary>
    /// Goes to page with some delay
    /// </summary>
    /// <param name="url">Full URL of page to go to</param>
    /// <param name="timeout">Delay before redirect in ms</param>

    timeout = Math.ceil(timeout * Math.random());
    setTimeout("window.location.href=" + page, timeout);
  };
}
