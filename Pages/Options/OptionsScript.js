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

		self.InitializeSettings();
		self.InitializePlugins();
		
		// Load settings
		var data = JSON.parse(localStorage.getItem("Settings"));
		if (data) {
			ko.mapping.fromJS(data, self.ViewModel);
		}

		// Save settings on change
		ko.watch(this.ViewModel, { depth: -1 }, function (parents, child, item) {
			var jsData = ko.mapping.toJS(self.ViewModel);
			localStorage.setItem("Settings", JSON.stringify(jsData));
		});

		ko.applyBindings(self.ViewModel);
	};

	this.InitializeSettings = function () {
		var self = this;
	};

	this.InitializePlugins = function () {
		var self = this;
		// Populate ViewModel with default values
		$.each(GlobalPluginsList, function (index, metadata) {
			metadata["ImageSource"] = GetPluginImage(metadata);
			metadata["State"] = ko.observable(true);
			metadata["toJSON"] = function() {
				return {
					Name: this.Name,
					State: this.State
				};
			};
			self.ViewModel.Plugins.push(metadata);
			return true;
		});
	};
};

$(document).ready(function () {
	// Instantiate options and initialize
	var optionsInstance = new Options();
	optionsInstance.Initialize();
});

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

