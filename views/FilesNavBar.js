(function() {
	var componentName = 'files-nav-bar';
	var s = `
		<div class="files-nav-bar container-fluid">
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
