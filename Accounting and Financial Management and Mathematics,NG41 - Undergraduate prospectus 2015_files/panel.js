(function(){ 

  var Panel = {

    config: {
        ajaxSettings: { 
          dataType: ($.support.cors) ? 'json' : 'jsonp',
          xhrFields: ( ($.support.cors) ? { withCredentials: true } : undefined )
        },
        analyticsCategory: 'MUSE menu',
        animationSpeed: 'fast',
        napHost: (location.hostname.match(/^(www\.)?shef(field)?\.ac\.uk$/i) === null) ?
                   'https://' + location.hostname : 'https://www.sheffield.ac.uk'
    },

    init: function() {
	$.ajax(Panel.config.napHost + '/nap/panel/menu', Panel.config.ajaxSettings)
		.done(function(data) {
			Panel.config.analyticsCategory += ' (' + data.menu.name + ')';
			Panel.drawPanel(data);
			if (data.notifications)
				Panel.addNotifications(data.notifications);
			
		})
		.fail(Panel.addLoginLink);
	
		$('head').append('<style>' + Panel.styles + '</style>');
		$(document).keyup(Panel.keypress);
	},

	addNotifications: function (notifications) {
		var urlSegment = '';
		$.each(notifications, function (key, note) {
			urlSegment = note.urlString;
			if (note.target=="DOM" && Panel.urlSegmentAtEnd(note.urlString)) {
				Panel.updateDomWithNotification(note);
			}
		});
	},

	urlSegmentAtEnd: function (urlString) {
		var startPos = document.URL.indexOf(urlString);
		if (startPos == -1) return false;

		var urlStringEndPos = startPos + urlString.length;
		if (urlStringEndPos == document.URL.length || urlStringEndPos == (document.URL.length-1)) return true;

		if (document.URL.indexOf("#") == urlStringEndPos) return true;
		if (document.URL.indexOf("?") == urlStringEndPos) return true;

		return false;
	},


	updateDomWithNotification: function (notification) {
		var targetElement = notification.domElement;
		var newContent = $(notification.announcement);
		newContent.hide();
		$(targetElement).prepend(newContent);
		newContent.fadeIn();
	},


    addLoginLink: function() {
      $('#topHeader nav ul').append(
        '<li><a id="nap" accesskey="m" href="' + Panel.config.napHost +
        '/nap/panel/login' + '">Log in to MUSE</a></li>');
    },
    
    drawPanel: function(data) {
      $('#topHeader nav ul').append(
        $('<li class="hidden-phone">Welcome back, </li>').append(
          $('<span id="nap_user"/>').text(data.name)), ' ',
        $('<li/>').append('<a id="nap" accesskey="m" href="#">My services</a> ')
          .on('click', Panel.togglePanel),
        $('<li><a id="nap_logout" href="' +
          Panel.config.napHost + '/nap/logout' + '">Log out</a></li>')
      );

      $('#topHeader').append( $('<div class="nap_background" id="nap_panel"/>').hide() );
      $('<ul id="nap_services"/>').appendTo('#nap_panel');

      $.each(data.menu.categories, function(key, category) {
    		Panel.drawCategory(key, category.items,'');
      });

	    if (data.recentClicks && data.recentClicks.length > 0) {
  		  Panel.drawCategory('recentClicks', data.recentClicks, 'recent');
	    }

      $('#nap_panel').append(
       $('<ul id="nap_panelNav"/>').append(
          '<li id="nap_allServices"><a href="' + Panel.config.napHost +
          '/muse/all-services">View all services</a></li>',
          $('<li/>').append( $('<a/>')
            .attr({id: 'nap_home', href: Panel.config.napHost + data.menu.landingPage, title: 'MUSE home'})
            .text('Home')
            .on('click', function() {
                Panel.trackEvent(Panel.config.analyticsCategory, 'home', undefined);
            })
          ),
          $('<li/>').append( $('<a/>')
            .attr({id: 'nap_close', href: '#', title: 'Close menu'})
            .text('Close')
            .on('click', Panel.togglePanel)
          )
        )
      );
    },
    
    drawCategory: function (key, category, extraClass) {
      var group = $('<ul class="nap_serviceGroup"/>');
		  if (extraClass.length>0) {
			  group.addClass(extraClass);
  		}
      $('#nap_services').append( $('<li>').append(group) );
      $.each(category, function(key, item) {
        Panel.drawServiceLink(key, item, group);            
      });
    },

    drawServiceLink: function (key, item, group) {
      $('<li>').append(
        $('<a>').attr({
          href: Panel.config.napHost + '/nap/service/' + 
            ((item.sso) ? 'sso/' : 'redirect/') + item.shortUrl,
          target: '_blank'
        })
        .text(item.name)
        .on('click', function() {
          Panel.trackEvent(Panel.config.analyticsCategory, 'service', item.shortUrl);
        })
		  ).appendTo(group);
    },

    keypress: function(e) {
      if (e.which === 27  && $('#nap_panel').is(':visible')) {
        Panel.togglePanel();
      }
    },
    
    togglePanel: function() {
      var state = ($('#nap_panel').is(':hidden')) ? 'open': 'close';
      if ( state === 'open' ) {
        $('#nap').toggleClass('nap_background');
        $('#nap_panel').slideToggle(Panel.config.animationSpeed);
      } else {
        $('#nap_panel').slideToggle(Panel.config.animationSpeed, function() {
          $('#nap').toggleClass('nap_background');
        });
      }
      Panel.trackEvent(Panel.config.analyticsCategory, state, undefined);
      return false;
    },
    
    trackEvent: function(category, action, label) {
      if (_gaq) {
        _gaq.push(['_trackEvent', category, action, label, undefined, true]);
      }
    },

    styles:
      '#topHeader a:focus { outline: #fff dotted thin; }' +
      '#topHeader nav ul li { color: #C7C7C7; }' +
      '#topHeader nav li~li:before { color: #fff; }' +

      '#nap:hover { cursor: pointer; }' +
      '#nap_logout { padding-right: 1.6em; background-position: right; background-repeat: no-repeat; background-size: 12px; }' +

      '#nap.nap_background, .nap_background { background-color: #1c467c; opacity: 0.98; }' +
      '#nap_panel { border-bottom: thin solid #656565; padding: 0; position: absolute; width: 100%; z-index: 5000; }' +
      '#nap_panel a:hover { text-decoration: underline; }' +
      '#nap_services, #nap_services ul { display: table; list-style: none; margin: 0; padding: 1.25em 0.75em 0 0.75em; table-layout: fixed; width: 100%;}' +
      '#nap_services ul.nap_serviceGroup { line-height: 1.3; padding: 0 0.75em; }' +
      '#nap_services li:nth-child(1n+2) ul.nap_serviceGroup { border-left: thin solid #656565; }' +
      '#nap_services li { margin-bottom: 0.5em; }' +
      '#nap_services > li { display: table-cell; }' +
      '#nap_services ul.nap_serviceGroup.recent a { color: #ffefad; }' +

      '#nap_panelNav { clear: both; height: 1.5em; list-style: none; padding: 0; position: relative; }' +
      '#nap_allServices, #nap_home, #nap_close { position: absolute; top: 0; }' +
      '#nap_allServices { text-align: center; line-height: 1.6em; width: 100%;}' +
      '#nap_close, #nap_home { background-position: center; background-repeat: no-repeat; background-size: contain; height: 1.5em; text-indent: -9999px; width: 2em; }' +
      '#nap_close { right: 2em; }' +
      '#nap_home { right: 5em; }' +

      '#nap_close { background-image: url(\'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyNSI+PG1ldGFkYXRhPmltYWdlL3N2Zyt4bWxpbWFnZS9zdmcreG1sPC9tZXRhZGF0YT48dGl0bGU+TGF5ZXIgMTwvdGl0bGU+PGcgdHJhbnNmb3JtPSJtYXRyaXgoMS4yNSAwIDAgLTEuMjUgNTQ1LjcxMyAxMDA1LjIyKSI+PHBhdGggZD0ibS00MjguNiA3ODYuMmwwIDE2IDAtMTZ6IiBmaWxsLXJ1bGU9Im5vbnplcm8iIGZpbGw9IiNjN2M3YzciLz48L2c+PGcgdHJhbnNmb3JtPSJtYXRyaXgoMS4yNSAwIDAgLTEuMjUgNTQ1LjcxNCA5ODUuMjE5KSI+PHBhdGggc3Ryb2tlLW1pdGVybGltaXQ9IjQiIGQ9Im0tNDI4LjYgNzg2LjJsMC0xNiIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2Utd2lkdGg9IjQiIHN0cm9rZT0iI2M3YzdjNyIgZmlsbD0ibm9uZSIvPjwvZz48cGF0aCBzdHJva2UtbWl0ZXJsaW1pdD0iNCIgZD0ibTIuNSAxMGw3LjUtNy41IDcuNSA3LjUiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLXdpZHRoPSI1IiBzdHJva2U9IiNjN2M3YzciIGZpbGw9Im5vbmUiLz48L3N2Zz4K\'); }' +
      '#nap_home { background-image: url(\'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMi41IiBoZWlnaHQ9IjIxLjIiPjxtZXRhZGF0YT5pbWFnZS9zdmcreG1sPC9tZXRhZGF0YT48dGl0bGU+TGF5ZXIgMTwvdGl0bGU+PGcgdHJhbnNmb3JtPSJtYXRyaXgoMS4yNSAwIDAgLTEuMjUgMjkxLjYwNyA4MzUuODQ0KSI+PHBhdGggZD0ibS0yMzMuMyA2NTkuN2wxOCAwIC05IDkgLTktOXoiIGZpbGw9IiNjN2M3YzciIGZpbGwtcnVsZT0ibm9uemVybyIvPjwvZz48cGF0aCBkPSJtMjAgMS4ybC0zLjcgMCAwIDcuNSAzLjggMCAwLTcuNXoiIGZpbGw9IiNjN2M3YzciIGZpbGwtcnVsZT0ibm9uemVybyIvPjxnIHRyYW5zZm9ybT0ibWF0cml4KDEuMjUgMCAwIC0xLjI1IDI5NC4xMDcgODM1Ljg0NCkiPjxwYXRoIGQ9Im0tMjMzLjMgNjU5LjdsMC04IDUgMCAwIDYgNCAwIDAtNiA1IDAgMCA4IC0xNCAweiIgZmlsbD0iI2M3YzdjNyIgZmlsbC1ydWxlPSJub256ZXJvIi8+PC9nPjwvc3ZnPgo=\'); }' +
      '#nap_logout { background-image: url(\'data:image/svg+xml;base64,PHN2ZyB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6Y2M9Imh0dHA6Ly9jcmVhdGl2ZWNvbW1vbnMub3JnL25zIyIgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIiBlbmFibGUtYmFja2dyb3VuZD0ibmV3IDAgMCAyNy43NjYgMjguODkzIiB4bWw6c3BhY2U9InByZXNlcnZlIiBoZWlnaHQ9IjI4Ljg5M3B4IiB2aWV3Qm94PSIwIDAgMjcuNzY2IDI4Ljg5MyIgd2lkdGg9IjI3Ljc2NnB4IiB2ZXJzaW9uPSIxLjEiIHk9IjBweCIgeD0iMHB4Ij48cGF0aCBkPSJNMTIuNTI3IDE1LjE0NmMwLjE4OSAwLjIgMC40IDAuMyAwLjcgMC40IDAuMyAwLjEgMC41IDAuMiAwLjggMC4yIDAuNiAwIDEuMDk4LTAuMjA5IDEuNTEtMC42MDQgMC40Mi0wLjQwNCAwLjY0MS0wLjkyMiAwLjY0MS0xLjQ5N3YtMTEuNTdjMC0wLjU3OS0wLjIyNS0xLjA5NS0wLjY0Ny0xLjQ5NC0wLjYxMS0wLjU3Ny0xLjUzNS0wLjc2Mi0yLjMxOC0wLjQyNC0wLjI0MSAwLjEwNC0wLjQ1OCAwLjI0OS0wLjY0NiAwLjQyNi0wLjE5MyAwLjE4Ni0wLjM0OCAwLjQwNy0wLjQ2IDAuNjY2LTAuMTEgMC4yNTQtMC4xNjUgMC41MzItMC4xNjUgMC44MjZ2MTEuNTY5YzAgMC4zIDAuMSAwLjYgMC4yIDAuOCAwLjEgMC4yIDAuMyAwLjUgMC40IDAuNjU5eiIgZmlsbD0iI0ZGRiIvPjxwYXRoIGQ9Ik0yNy4zODUgMTEuNzk0Yy0wLjI1Mi0wLjk0LTAuNTc2LTEuODA0LTAuOTYxLTIuNTY1LTAuMzgxLTAuNzUxLTAuODA1LTEuNDI4LTEuMjYtMi4wMTQtMC40MzYtMC41NTctMC44NDQtMS4wNDgtMS4xNTYtMS4zODVsLTAuMTQ4LTAuMjA0Yy0wLjM3OS0wLjM5NC0wLjg1LTAuNjEzLTEuNDA0LTAuNjU0bC0wLjE1NC0wLjAwNmMtMC41MTYgMC0wLjk5NCAwLjE5OC0xLjM3MSAwLjU2My0wLjIwNyAwLjE4OS0wLjM3NSAwLjQwOS0wLjQ5NiAwLjY1MS0wLjEyMyAwLjI0OC0wLjE5NSAwLjUxNC0wLjIxNSAwLjc4Ni0wLjAxNiAwLjMgMCAwLjUgMC4xIDAuOCAwLjEgMC4zIDAuMiAwLjUgMC40IDAuNzU0bDAuOTM4IDEuMDY1YzAuMjkzIDAuMyAwLjYgMC44IDAuOCAxLjMgMC4zIDAuNSAwLjUgMS4xIDAuNyAxLjcgMC4yIDAuNyAwLjMgMS40IDAuMyAyLjMgMCAwLjkxLTAuMTE1IDEuODAzLTAuMzQyIDIuNjUxLTAuMjI5IDAuODQ5LTAuNTUzIDEuNjUxLTAuOTY3IDIuMzg0LTAuNDEgMC43MjktMC45MTYgMS40MDctMS40OTggMi4wMTctMC41NzggMC42MDQtMS4yMjkgMS4xMjYtMS45MzQgMS41NTMtMC43MDMgMC40MjYtMS40NzEgMC43NjQtMi4yODUgMS0xLjYyNSAwLjQ3LTMuNDU4IDAuNDctNS4wNzggMC0wLjgxNy0wLjIzNy0xLjU5MS0wLjU3NC0yLjI5OS0xLjAwMXMtMS4zNTktMC45NDktMS45MzgtMS41NTJjLTAuNTgxLTAuNjA5LTEuMDg3LTEuMjg3LTEuNDk3LTIuMDE3LTAuNDE2LTAuNzMyLTAuNzQtMS41MzMtMC45NjgtMi4zODQtMC4yMjktMC44NDgtMC4zNDMtMS43NDEtMC4zNDMtMi42NTEgMC0wLjg4NyAwLjEwNS0xLjY2OCAwLjMxNS0yLjMyMSAwLjIxNy0wLjY3MyAwLjQ3Ny0xLjI2NiAwLjc3OC0xLjc2MyAwLjMwNC0wLjUwNSAwLjYyNi0wLjkzNSAwLjk1NC0xLjI3N2wxLjAzNi0xLjA3NGMwLjIwNi0wLjIwNyAwLjM1OS0wLjQ1IDAuNDU2LTAuNzIgMC4wOTUtMC4yNjggMC4xMy0wLjU0NSAwLjEwNC0wLjgzMS0wLjAyNi0wLjI2Ni0wLjEwMi0wLjUyMi0wLjIxOC0wLjc1My0wLjEyMi0wLjI0Ni0wLjI4OC0wLjQ2Ny0wLjQ5NS0wLjY1Ny0wLjIxNi0wLjE5OC0wLjQ2Mi0wLjM0Ny0wLjczMS0wLjQ0LTAuMjM0LTAuMDc5LTAuNDctMC4xMjEtMC43Ny0wLjEyMWgtMC4wMTFjLTAuMjc1IDAuMDA4LTAuNTQzIDAuMDcyLTAuNzk4IDAuMTkzLTAuMjM5IDAuMTExLTAuNDU2IDAuMjY0LTAuNjQ2IDAuNDU1bC0wLjE1OCAwLjIzNWMtMC4zNDcgMC4zOTItMC43MzYgMC44MzctMS4xNjggMS4zMzctMC40OTIgMC41NzItMC45NjMgMS4yNDgtMS40IDIuMDA2LTAuNDM4IDAuNzU5LTAuODExIDEuNjI0LTEuMTA3IDIuNTY4LTAuMzA1IDAuOTYzLTAuNDU5IDIuMDYzLTAuNDU5IDMuMyAwIDEuMyAwLjIgMi41IDAuNSAzLjcgMC4zIDEuMiAwLjggMi4zIDEuNCAzLjMgMC42IDEgMS4zIDIgMi4yIDIuOCAwLjggMC45IDEuOCAxLjYgMi44IDIuMiAxIDAuNiAyLjEgMS4xIDMuMyAxLjQgMS4yIDAuMyAyLjQgMC41IDMuNyAwLjUgMS4zIDAgMi41MS0wLjE2OCAzLjY5NC0wLjUgMS4xNzItMC4zMzEgMi4yODUtMC44IDMuMzA3LTEuMzkzIDEuMDI3LTAuNTk3IDEuOTcxLTEuMzI4IDIuODEyLTIuMTc1IDAuODQtMC44NDUgMS41Ny0xLjc4OSAyLjE2Ni0yLjgwMyAwLjYwNC0xLjAyMSAxLjA3Mi0yLjEzNSAxLjM5OC0zLjMxMSAwLjMyNi0xLjE4MSAwLjQ5LTIuNDIgMC40OS0zLjY4NyAwLjAwMi0xLjE4Ny0wLjEyNS0yLjI3NC0wLjM3OS0zLjIzMnoiIGZpbGw9IiNGRkYiLz48L3N2Zz4=\'); }' +
      // IE<8
      '#breadcrumbs { *display: none; }' +
      '#nap_panel { *position: relative; }' +
      '#nap_services ul.nap_serviceGroup { *float: left; *width: 22%; }'
  };
  
  $(document).ready( Panel.init );

})();
