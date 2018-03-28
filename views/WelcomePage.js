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
						<add-new-connection-form></add-new-connection-form>
					</div>
				</div>
				<div class="col-xs-12 col-sm-6">
					<div class="info-panel">
						<h2>Project News</h2>
						<hr />
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
