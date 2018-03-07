(function() {
	var componentName = 'settings-side-bar';
	var s = `
		<div class="settings-side-bar side-bar container-fluid">
			<div class="row">
				<div class="col-xs-12">
					<h2>Settings</h2>
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
