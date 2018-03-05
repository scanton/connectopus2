(function() {
	var componentName = 'settings-side-bar';
	var s = `
		<div class="settings-side-bar side-bar">
			
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
