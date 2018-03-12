(function() {
	var componentName = 'welcome-page';
	var s = `
		<div class="welcome-page container-fluid">
			<div class="row">
				<div class="col-xs-12">
					<h1>Connectopus 2</h1>
					<h2>Multilegged Diff, Merge & Sync</h2>
					<hr />
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
