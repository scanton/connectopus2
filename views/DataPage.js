(function() {
	var componentName = 'data-page';
	var s = `
		<div class="data-page container-fluid">
			<div class="row">
				<div class="col-xs-12">
					<h1>Data</h1>
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
