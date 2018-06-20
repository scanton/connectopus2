(function() {
	var componentName = 'settings-side-bar';
	var s = `
		<div class="settings-side-bar side-bar container-fluid">
			<div class="row">
				<div class="col-xs-12 bare-container">
					<h2>Settings</h2>
					<div class="input-group right-style">
						<div class="dropdown">
							<button class="btn btn-default dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
								{{settings.theme}}
								<span class="caret"></span>
							</button>
							<ul v-on:click="handleThemeChange" class="dropdown-menu">
								<li v-for="theme in themes"><a href="#">{{ theme }}</a></li>
							</ul>
						</div>
						<span class="input-group-addon">Theme</span>
					</div>
					<div class="input-group right-style">
						<button v-show="settings.hideFilesInSync" class="btn btn-success" v-on:click="handleDeactivateHideFilesInSync">ON</button>
						<button v-show="!settings.hideFilesInSync" class="btn btn-danger" v-on:click="handleActivateHideFilesInSync">OFF</button>
						<span class="input-group-addon">Hide Files In Sync</span>
					</div>
					<!--
					<div class="input-group right-style">
						<button v-show="settings.maximizeContrast" class="btn btn-success" v-on:click="handleDeactiveMaxContrast">ON</button>
						<button v-show="!settings.maximizeContrast" class="btn btn-danger" v-on:click="handleActiveMaxContrast">OFF</button>
						<span class="input-group-addon">Rainbow Contrast</span>
					</div>
					-->
					<div class="input-group right-style db-options-toggle">
						<button v-show="settings.enableDatabaseOptions" class="btn btn-success" v-on:click="handleDeactiveDatabaseOptions">ON</button>
						<button v-show="!settings.enableDatabaseOptions" class="btn btn-danger" v-on:click="handleActiveDatabaseOptions">OFF</button>
						<span class="input-group-addon">Database Options</span>
					</div>
					<div v-show="settings && settings.enableDatabaseOptions" class="input-group right-style">
						<input v-on:change="handleMaxRowsChange" type="number" v-bind:value="settings.maxRowsRequested" />
						<span class="input-group-addon">Max DB Rows</span>
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
		props: ['maximizeContrast'],
		data: function() {
			return {
				themes: [],
				settings: {
				}
			}
		},
		methods: {
			handleActiveDatabaseOptions: function(e) {
				e.preventDefault();
				controller.setDatabaseOptionsEnabled(true);
			},
			handleDeactiveDatabaseOptions: function(e) {
				e.preventDefault();
				controller.setDatabaseOptionsEnabled(false);
			},
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
