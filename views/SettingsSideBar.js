(function() {
	var componentName = 'settings-side-bar';
	var s = `
		<div class="settings-side-bar side-bar container-fluid">
			<div class="row">
				<div class="col-xs-12">
					<h2>Settings</h2>
					<!--<button v-on:click="handleThemeToggle" class="btn btn-info">Toggle Azure Style</button>-->

					<div class="input-group">
						<span class="input-group-addon">Theme</span>
						<div class="dropdown">
							<button class="btn btn-default dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
								{{settings.theme}}
								<span class="caret"></span>
							</button>
							<ul v-on:click="handleThemeChange" class="dropdown-menu">
								<li><a href="#">Sunset Sherbert</a></li>
								<li><a href="#">Azure Styles</a></li>
							</ul>
						</div>
					</div>
					<div class="input-group">
						<span class="input-group-addon">Max DB Rows</span>
						<input v-on:change="handleMaxRowsChange" type="number" v-bind:value="settings.maxRowsRequested" />
					</div>
				</div>
			</div>
		</div>
	`;
	
	Vue.component(componentName, {
		created: function() {
			viewController.registerView(componentName, this);
		},
		template: s,
		data: function() {
			return {
				settings: {}
			}
		},
		methods: {
			handleMaxRowsChange: function(e) {
				controller.setMaxRowsRequested($(e.target).val());
			},
			handleThemeChange: function(e) {
				controller.setTheme($(e.target).text());
			},
			setSettings: function(settings) {
				this.settings = settings;
			}
		}
	});
})();
