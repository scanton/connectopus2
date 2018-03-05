(function() {
	var componentName = 'top-nav';
	var s = `
		<nav class="navbar navbar-inverse">
			<span class="refresh-browser-link nav-link" title="Refresh">
				<a href="#" v-on:click="refresh">
					<span class="glyphicon glyphicon-refresh"></span>
				</a>
			</span>
			<span class="toggle-dev-tools-link nav-link" title="Developer Tools">
				<a href="#" v-on:click="toggleDevTools">
					<span class="glyphicon glyphicon-wrench"></span>
				</a>
			</span>
			<span class="toggle-dev-tools-link nav-link" title="Settings">
				<a href="#" v-on:click="onToggleSettings">
					<span class="glyphicon glyphicon-option-horizontal"></span>
				</a>
			</span>
		</nav>
	`;

	Vue.component(componentName, {
		created: function() {
			viewController.registerView(componentName, this);
		},
		template: s,
		data: function() {
			return {
				title: 'Connectopus 2',
				dropDown1: {
					title: 'Connectopus 2',
					icon: 'glyphicon glyphicon-globe',
					childLinks: [{
							title: 'New Project',
							clickHandler: 'controller.createNewProject()'
						},
						{
							title: 'Open Project...',
							clickHandler: 'controller.openProject()'
						},
						{
							type: 'line-break'
						},
						{
							title: 'Import Project...',
							clickHandler: 'controller.showImportProjectView()'
						}
					]
				},
				projectName: null
			}
		},
		methods: {
			onToggleSettings: function(e) {
				e.preventDefault();
				viewController.callViewMethod("work-area", "toggleSettings");
			},
			setProjectName: function(name) {
				this.projectName = name;
			},
			refresh: function() {
				location.reload();
			},
			toggleDevTools: function() {
				remote.getCurrentWindow().toggleDevTools();
			}
		}
	});
})();
