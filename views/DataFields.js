(function() {
	var componentName = 'data-fields';
	var s = `
		<div class="data-fields container-fluid">
			<div class="row">
				<div class="col-xs-12 col-md-4">
					<h3>Display Fields</h3>
					<field-list v-on:change="handleDisplayChange" v-bind:fields="fields" type="Display Field"></field-list>
				</div>
				<div class="col-xs-12 col-md-4">
					<h3>Sort By</h3>
					<field-list v-on:change="handleSortByChange" v-bind:fields="fields" type="Sort Field" isSortField="1"></field-list>
				</div>
				<div class="col-xs-12 col-md-4">
					<h3>Field Exclusions</h3>
					<field-list v-on:change="handleExclusionChange" v-bind:fields="fields" type="Field Exclusion"></field-list>
				</div>
			</div>
			<div class="row">
				<button v-on:click="handleSaveViewSettings" class="btn btn-success pull-right save-button">Save View Settings</button>
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
				selectedExclusionFields: [],
				selectedDisplayFields: [],
				selectedSortFields: [],
				sortOptions: {}
			}
		},
		methods: {
			handleExclusionChange: function(data) {
				this.selectedExclusionFields = data.selectedFields;
			},
			handleDisplayChange: function(data) {
				this.selectedDisplayFields = data.selectedFields;
			},
			handleSaveViewSettings: function(e) {
				this.$emit("save-vew-settings", stripObservers({
					selectedExclusionFields: this.selectedExclusionFields,
					selectedDisplayFields: this.selectedDisplayFields,
					selectedSortFields: this.selectedSortFields,
					sortOptions: this.sortOptions
				}));
			},
			handleSortByChange: function(data) {
				this.selectedSortFields = data.selectedFields;
				this.sortOptions = data.sortOptions;
			}
		}
	});
})();
