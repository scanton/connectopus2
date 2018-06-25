(function() {
	var componentName = 'field-list';
	var s = `
		<ul class="field-list">
			<li v-for="field in fields">
				<check-box v-if="!isSortField"></check-box>
				<ascend-decend-selector v-if="isSortField"></ascend-decend-selector>
				{{field.name}}
			</li>
		</ul>
	`;
	
	Vue.component(componentName, {
		created: function() {
			viewController.registerView(componentName, this);
		},
		props: ["fields", "isSortField", "selectedFileds"],
		template: s,
		data: function() {
			return {}
		},
		methods: {
			
		}
	});
})();
