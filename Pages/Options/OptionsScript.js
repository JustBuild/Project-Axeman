function Options() {
	// Create ViewModel with mapping
	this.ViewModel = ko.mapping.fromJS(new Models.OptionsModel(), {
		Plugins: {
			key: function(data) {
				return ko.utils.unwrapObservable(data.Name);
			}
		}
	});

	this.Initialize = function () {
		var self = this;

		// Load default values
		self.InitializePlugins();
		self.InitializeSettings();

		// Apply existing settings
		var data = localStorage.getItem("Settings");
		if (data) {
			var jsData = $.parseJSON(data);

			// Sort plugins settings
			var sortedPluginsSettings = jsData.Plugins.sort(function(left, right) {
				return left.Name > right.Name ? 1 : -1;
			});

			ko.mapping.fromJS(sortedPluginsSettings, {}, self.ViewModel);
			console.log("Mapped saved data to models");
		}

		// Save settings on change
		ko.watch(this.ViewModel, { depth: -1 }, function (parents, child, item) {
			console.log("Data changed. Saving...");
			var jsData = ko.mapping.toJS(self.ViewModel);
			localStorage.setItem("Settings", JSON.stringify(jsData));
		});

		console.log("Binding...");
		ko.applyBindings(self.ViewModel);
	};

	this.InitializeSettings = function () {
		var self = this;
	};

	this.InitializePlugins = function () {
		var self = this;

		// Sort plugins metadata
		var sortedPluginsMetadata = GlobalPluginsList.sort(function(left, right) {
			return left.Name > right.Name ? 1 : -1;
		});

		// Populate ViewModel with default values
		$.each(sortedPluginsMetadata, function (index, metadata) {
			$.each(metadata.CustomSettings, function(index, obj) {
				obj.Value = obj.DefaultValue;
				if (!obj.Description) obj.Description = false;
				if (!obj.Link) obj.Link = false;
			});
			metadata.CustomSettings = ko.mapping.fromJS(metadata.CustomSettings);
			metadata.ImageSource = GetPluginImage(metadata);
			metadata.State = ko.observable(true);
			metadata.IsOptionsShown = ko.observable(false);
			metadata.toJSON = function() {
				return {
					Name: this.Name,
					State: this.State,
					CustomSettings: this.CustomSettings
				};
			};
			self.ViewModel.Plugins.push(metadata);
			console.log("Processed model of " + metadata.Name);
			return true;
		});

		console.log("Plugins initialized");
	};
};

$(document).ready(function () {
	// Instantiate options and initialize
	var optionsInstance = new Options();
	optionsInstance.Initialize();
	setupClearSettings();
});

function setupClearSettings() {
	$("#clearSettings").click(function () {
		localStorage.removeItem("Settings");
	});
}

//
// chrome-bootstrap
//
$(function () {
	$('.menu a').click(function (ev) {
		ev.preventDefault();
		var selected = 'selected';

		$('.mainview > *').removeClass(selected);
		$('.menu li').removeClass(selected);
		setTimeout(function () {
			$('.mainview > *:not(.selected)').css('display', 'none');
		}, 100);

		// Rename title to selected item
		$("title").text($(ev.currentTarget).text());

		$(ev.currentTarget).parent().addClass(selected);
		var currentView = $($(ev.currentTarget).attr('href'));
		currentView.css('display', 'block');
		setTimeout(function () {
			currentView.addClass(selected);
		}, 0);

		setTimeout(function () {
			$('body')[0].scrollTop = 0;
		}, 200);
	});

	$('#launch_modal').click(function (ev) {
		ev.preventDefault();
		var modal = $('.overlay').clone();
		$(modal).removeAttr('style');
		$(modal).find('button, .close-button').click(function () {
			$(modal).addClass('transparent');
			setTimeout(function () {
				$(modal).remove();
			}, 1000);
		});

		$(modal).click(function () {
			$(modal).find('.page').addClass('pulse');
			$(modal).find('.page').on('webkitAnimationEnd', function () {
				$(this).removeClass('pulse');
			});
		});
		$(modal).find('.page').click(function (ev) {
			ev.stopPropagation();
		});
		$('body').append(modal);
	});

	$('.mainview > *:not(.selected)').css('display', 'none');
});

