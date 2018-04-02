(function() {
	var componentName = 'files-nav-bar';
	var s = `
		<div class="files-nav-bar container-fluid">
			<div class="row">
				<div class="col-xs-12">
					<button class="btn btn-warning pull-right">Sync Selected Files</button>
					<button class="btn btn-default">www</button> / stuff
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
