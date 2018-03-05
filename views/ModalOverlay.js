(function() {
	var componentName = 'modal-overlay';
	var s = `
		<div class="modal-overlay" style="display: none;">
			
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
