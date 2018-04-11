(function() {
	var componentName = 'top-nav';
	var s = `
		<nav class="top-nav navbar">
			<div class="pull-right system-icons">
				<!--
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
				-->
				<span class="toggle-dev-tools-link nav-link" title="Settings">
					<a href="#" v-on:click="onToggleSettings">
						<span class="glyphicon glyphicon-option-horizontal"></span>
					</a>
				</span>
			</div>
			<project-tabs></project-tabs>
		</nav>
	`;

	Vue.component(componentName, {
		created: function() {
			viewController.registerView(componentName, this);
		},
		template: s,
		data: function() {
			return {
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
