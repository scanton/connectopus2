(function() {
	var componentName = 'current-directories';
	var s = `
		<div class="current-directories container-fluid scroll-overflow">
			<div class="row">
				<div class="col-xs-12">
					<h2>Directories</h2>
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
