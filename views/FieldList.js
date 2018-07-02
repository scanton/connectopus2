(function() {
	var componentName = 'field-list';
	var s = `
		<div v-bind:class="{'has-selected-fields': selectedFields.length}" class="field-list">
			<div class="dropdown">
				<button class="btn btn-default dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
					<span class="glyphicon glyphicon-plus"></span>
					Add {{type}}
					<span class="caret"></span>
				</button>
				<ul class="dropdown-menu">
					<li v-on:click="handleAddField(field.name)" v-for="field in filteredFields"><a href="#">{{ field.name }}</a></li>
				</ul>
			</div>
			<div draggable="true" v-on:dragstart="handleDragStart($event, selectedField)" v-on:drop="handleDrop($event, selectedField)" v-on:dragover="allowDrop" v-for="selectedField in selectedFields" v-bind:class="{'is-sort-field': isSortField, 'is-drag-over': isDragOver}" class="selected-field">
				<button v-on:click="handleRemoveField(selectedField)" class="btn btn-danger" title="Delete Field">
					<span class="glyphicon glyphicon-remove"></span>
				</button>
				{{selectedField}}
				<ascend-decend-selector v-if="isSortField" v-on:change="handleSortTypeChange" v-bind:id="selectedField" class="pull-right"></ascend-decend-selector>
			</div>
		</div>
	`;
	
	Vue.component(componentName, {
		created: function() {
			viewController.registerView(componentName, this);
		},
		watch: {
			fields: function(val) {
				this.filteredFields = this._filterFields();
			}
		},
		props: ["fields", "isSortField", "selectedFileds", "type"],
		template: s,
		data: function() {
			return {
				filteredFields: [],
				selectedFields: [],
				sortOptions: {},
				isDragOver: false
			}
		},
		methods: {
			_filterFields: function() {
				var a = [];
				var l = this.fields.length;
				var field;
				for(var i = 0; i < l; i++) {
					field = this.fields[i];
					if(!this.hasSelectedField(field)) {
						a.push(field);
					}
				}
				return a;
			},
			allowDrop: function(e) {
				e.preventDefault();
			},
			handleAddField: function(name) {
				if(!this.hasSelectedField(name)) {
					this.selectedFields.push(name);
					this.filteredFields = this._filterFields();
					this.$emit("change", {selectedFields: this.selectedFields, sortOptions: this.sortOptions});
				}
			},
			handleDragStart: function(e, field) {
				e.dataTransfer.setData("field", field);
				e.dataTransfer.setData("type", this.type);
			},
			handleDrop: function(e, dropField) {
				var selectedField = e.dataTransfer.getData("field");
				if(e.dataTransfer.getData("type") == this.type && (selectedField != dropField)) {
					e.preventDefault();
					this.handleRemoveField(selectedField);
					var l = this.selectedFields.length;
					while(l--) {
						if(this.selectedFields[l] == dropField) {
							this.selectedFields.splice(l + 1, 0, selectedField);
							break;
						}
					}
					this.$emit("change", {selectedFields: this.selectedFields, sortOptions: this.sortOptions});
				}
			},
			handleRemoveField: function(name) {
				var l = this.selectedFields.length;
				while(l--) {
					if(this.selectedFields[l] == name) {
						this.selectedFields.splice(l, 1);
					}
				}
				this.filteredFields = this._filterFields();
				this.$emit("change", {selectedFields: this.selectedFields, sortOptions: this.sortOptions});
			},
			handleSortTypeChange: function(data) {
				this.sortOptions[data.id] = data.mode;
			},
			hasSelectedField: function(name) {
				var l = this.selectedFields.length;
				while(l--) {
					if(this.selectedFields[l] == name.name) {
						return true;
					}
				}
				return false;
			}
		}
	});
})();
