(function() {
	var componentName = 'settings-side-bar';
	var s = `
		<div class="settings-side-bar side-bar container-fluid">
			<div class="row">
				<div class="col-xs-12 bare-container">
					<h2>Settings</h2>
					<!--<button v-on:click="handleThemeToggle" class="btn btn-info">Toggle Azure Style</button>-->

					<div class="input-group">
						<span class="input-group-addon">Hide Files In Sync</span>
						<button v-show="settings.hideFilesInSync" class="btn btn-success" v-on:click="handleDeactivateHideFilesInSync">ON</button>
						<button v-show="!settings.hideFilesInSync" class="btn btn-danger" v-on:click="handleActivateHideFilesInSync">OFF</button>
					</div>
					<div class="input-group">
						<span class="input-group-addon">Rainbow Contrast</span>
						<button v-show="settings.maximizeContrast" class="btn btn-success" v-on:click="handleDeactiveMaxContrast">ON</button>
						<button v-show="!settings.maximizeContrast" class="btn btn-danger" v-on:click="handleActiveMaxContrast">OFF</button>
					</div>
					<div class="input-group">
						<span class="input-group-addon">Theme</span>
						<div class="dropdown">
							<button class="btn btn-default dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
								{{settings.theme}}
								<span class="caret"></span>
							</button>
							<ul v-on:click="handleThemeChange" class="dropdown-menu">
								<li v-for="theme in themes"><a href="#">{{ theme }}</a></li>
							</ul>
						</div>
					</div>
					<!--
					<div class="input-group">
						<span class="input-group-addon">Max DB Rows</span>
						<input v-on:change="handleMaxRowsChange" type="number" v-bind:value="settings.maxRowsRequested" />
					</div>
					-->
				</div>
			</div>
		</div>
	`;
	
	Vue.component(componentName, {
		created: function() {
			viewController.registerView(componentName, this);
		},
		template: s,
		props: ['maximizeContrast'],
		data: function() {
			return {
				themes: [],
				settings: {
				}
			}
		},
		methods: {
			handleActivateHideFilesInSync: function(e) {
				e.preventDefault();
				controller.setHideFilesInSync(true);
			},
			handleDeactivateHideFilesInSync: function(e) {
				e.preventDefault();
				controller.setHideFilesInSync(false);
			},
			handleActiveMaxContrast: function(e) {
				e.preventDefault();
				controller.setMaximizeContrast(true);
			},
			handleDeactiveMaxContrast: function(e) {
				e.preventDefault();
				controller.setMaximizeContrast(false);
			},
			handleMaxRowsChange: function(e) {
				controller.setMaxRowsRequested($(e.target).val());
			},
			handleThemeChange: function(e) {
				var $this = $(e.target);
				if($this.is("a")) {
					controller.setTheme($this.text());
				}
			},
			setSettings: function(settings) {
				this.settings = settings;
			},
			setThemes: function(themes) {
				this.themes = themes;
			}
		}
	});
})();
