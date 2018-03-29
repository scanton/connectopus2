(function() {
	var componentName = 'welcome-page';
	var s = `
		<div class="welcome-page container-fluid">
			<div class="row">
				<div class="col-xs-12">
					<img src="assets/connectopus-logo-monochrome.svg" style="max-width: 150px; margin: 1em 1em 0 0" class="pull-left" />
					<h1 class="word-connectopus"><strong>Connect</strong>opus 2</h1>
					<h2>Diff / Merge / Sync</h2>
					<hr />
				</div>
			</div>
			<div class="row">
				<div class="col-xs-12 col-sm-6">
					<div class="info-panel">
						<h2>Getting Started</h2>
						<hr />
						<h3>Start By Creating a Connection</h3>
						<p>Click the <span class="connections-tab-example"><span class="glyphicon glyphicon-globe"></span> Connections Tab</span> on the tool bar to the left to create and organize your connections.</p>
						<hr />
						<h3>Understanding Projects</h3>
						<p>Projects are a way of organizing your LIVE connections.</p>
						<p>Connection data (the information about how to connect to a particular data source) is shared between projects.  You only have to create a connection once, and you will be able to use it in any project.</p>
						<p>You CAN have LIVE connections to the SAME data source in more than one project at the SAME TIME.</p>
						<hr />
						<h3>Documentation</h3>
						<p>Documentation will be produced and available at <a target="_blank" href="http://connectopus.org">Connectopus.org</a></p>
					</div>
				</div>
				<div class="col-xs-12 col-sm-6">
					<div class="info-panel">
						<project-news></project-news>
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
			return {}
		},
		methods: {}
	});
})();
