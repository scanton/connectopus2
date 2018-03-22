(function() {
	var componentName = 'current-tables';
	var s = `
		<div class="current-tables container-fluid scroll-overflow">
			<div class="row">
				<div class="col-xs-12">
					<h2>Tables</h2>
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
