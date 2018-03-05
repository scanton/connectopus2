(function() {
	var componentName = 'context-side-bar';
	var s = `
		<div class="context-side-bar side-bar">
			<current-connections></current-connections>
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
