(function() {
	var componentName = 'current-connections';
	var s = `
		<div class="current-connections container-fluid">
			<div class="row">
				<div class="col-xs-12">
					
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
