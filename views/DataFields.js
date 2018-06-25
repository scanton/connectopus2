(function() {
	var componentName = 'data-fields';
	var s = `
		<div class="data-fields container-fluid">
			<div class="row">
				<div class="col-xs-12 col-md-4">
					<h3>Match Filter</h3>
					<field-list v-bind:fields="fields"></field-list>
				</div>
				<div class="col-xs-12 col-md-4">
					<h3>Sort By</h3>
					<field-list v-bind:fields="fields" isSortField="1"></field-list>
				</div>
				<div class="col-xs-12 col-md-4">
					<h3>Display</h3>
					<field-list v-bind:fields="fields"></field-list>
				</div>
			</div>
		</div>
	`;
	
	Vue.component(componentName, {
		created: function() {
			viewController.registerView(componentName, this);
		},
		template: s,
		props: ["fields"],
		data: function() {
			return {
				
			}
		},
		methods: {
			
		}
	});
})();
