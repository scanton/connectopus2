(function() {
	var componentName = 'field-selector';
	var s = `
		<div class="field-selector">
			<div v-for="field in fields" class="field">
				<check-box v-bind:data-field="field.column"></check-box>
				{{field.column}}
			</div>
		</div>
	`;
	
	Vue.component(componentName, {
		created: function() {
			viewController.registerView(componentName, this);
		},
		props: ["fields"],
		template: s,
		data: function() {
			return {}
		},
		methods: {
		}
	});
})();
