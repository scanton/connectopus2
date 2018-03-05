(function() {
	var componentName = 'files-page';
	var s = `
		<div class="files-page container-fluid">
			<div class="row">
				<div class="col-xs-12">
					<h1>Files</h1>
					
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
