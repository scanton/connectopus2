(function() {
	var componentName = 'active-connection';
	var s = `
		<div class="active-connection">
			active - connection
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
