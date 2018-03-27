(function() {
	var componentName = 'project-tabs';
	var s = `
		<ul class="project-tabs container-fluid">
			<li class="tab selected">Unnamed Project</li>
			<li class="tab add-tab">
				<span class="glyphicon glyphicon-plus"></span>
			</li>
		</ul>
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
