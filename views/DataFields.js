(function() {
	var componentName = 'data-fields';
	var s = `
		<div class="data-fields container-fluid">
			<div class="row">
				<div class="col-xs-12 col-md-4">
					<h3>Display Fields</h3>
					<field-list 
						v-on:change="handleDisplayChange" 
						v-bind:fields="fields"
						v-bind:selectedFields="selectedDisplayFields"
						type="Display Field"
					></field-list>
				</div>
				<div class="col-xs-12 col-md-4">
					<h3>Sort By</h3>
					<field-list 
						v-on:change="handleSortByChange" 
						v-bind:fields="fields"
						v-bind:selectedFields="selectedSortFields"
						v-bind:selectedSortOptions="sortOptions"
						type="Sort Field" 
						isSortField="1"
					></field-list>
				</div>
				<div class="col-xs-12 col-md-4">
					<h3>Field Exclusions</h3>
					<field-list 
						v-on:change="handleExclusionChange" 
						v-bind:fields="fields" 
						v-bind:selectedFields="selectedExclusionFields"
						type="Field Exclusion"
					></field-list>
				</div>
			</div>
			<div class="row">
				<button v-on:click="handleToggleViewSettings" class="btn btn-default">
					Hide View Settings
				</button>
				<button 
					class="btn btn-success pull-right save-button"
					v-on:click="handleSaveViewSettings" 
				>Save View Settings</button>
				<button 
					class="btn btn-danger pull-right delete-button"
					v-if="selectedExclusionFields.length || selectedDisplayFields.length || selectedSortFields.length" 
					v-on:click="handleRemoveViewSettings" 
				>Delete View Settings</button>
			</div>
		</div>
	`;
	
	Vue.component(componentName, {
		created: function() {
			viewController.registerView(componentName, this);
		},
		watch: {
			fieldData: function(data) {
				if(data) {
					this.selectedExclusionFields = data.selectedExclusionFields;
					this.selectedDisplayFields = data.selectedDisplayFields;
					this.selectedSortFields = data.selectedSortFields;
					this.sortOptions = data.sortOptions;
				} else {
					this.selectedExclusionFields = [];
					this.selectedDisplayFields = [];
					this.selectedSortFields = [];
					this.sortOptions = {};
				}
			}
		},
		template: s,
		props: ["fields", "fieldData"],
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
			handleRemoveViewSettings: function(e) {
				this.$emit("delete-view-settings");
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
			},
			handleToggleViewSettings: function(e) {
				this.$emit("toggle-view-settings");
			}
		}
	});
})();
