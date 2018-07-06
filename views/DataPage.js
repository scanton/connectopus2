(function() {
	var componentName = 'data-page';
	var s = `
		<div class="data-page container-fluid">
			<div class="row">
				<div class="col-xs-12">
					<data-nav-bar v-bind:showRelationsButton="selectedTable != ''"></data-nav-bar>
				</div>
			</div>
			<div v-show="fields.length" class="row">
				<div class="col-xs-12">
					<data-fields 
						v-on:save-vew-settings="handleSaveViewSettings"
						v-on:delete-view-settings="handleDeleteViewSetings"
						v-bind:fields="fields"
						v-bind:fieldData="getFieldData(selectedTable)"
					></data-fields>
				</div>
			</div>
			<div v-show="selectedTable != ''" class="row main-data-container">
				<div class="col-xs-12 bare-container data-listing">
					<table class="data-listing-table">
						<tr>
							<th class="connection-name" v-for="(conId, index) in connections" v-bind:style="getStyle(index, totalConnections, maximizeContrast)">
								<span class="pull-left" v-if="index == 0"><input v-on:click="handleSelectAll" type="checkbox" /></span>
								{{getName(conId)}}
							</th>
						</tr>
						<tr v-for="row in renderRows">
							<td class="data-compare-listing" v-for="(conId, index) in connections" v-bind:style="getStyle(index, totalConnections, maximizeContrast)">
								<span v-if="row[index]">
									{{row[index].displayData}}
								</span>
							</td>
						</tr>
					</table>
				</div>
			</div>
		</div>
	`;
	
	Vue.component(componentName, {
		created: function() {
			viewController.registerView(componentName, this);
		},
		template: s,
		data: function() {
			return {
				connections: [],
				tables: [],
				fields: [],
				selectedTable: '',
				selectedParent: 'Select Table',
				selectedChild: 'Select Table',
				selectedParentColumn: 'Select Column',
				selectedChildColumn: 'Select Column',
				maximizeContrast: null,
				totalConnections: 0,
				primeConnection: null,
				viewParameters: null,
				renderRows: []
			}
		},
		methods: {
			getColumns: function(name) {
				if(name != "Select Table") {
					var l = this.tables.length;
					for(var i = 0; i < l; i++) {
						if(this.tables[i][0].table == name) {
							return this.tables[i];
						}
					}
				}
				return [];
			},
			getFieldData: function(selectedTable) {
				if(selectedTable && this.primeConnection && this.primeConnection.tableViews) {
					return this.primeConnection.tableViews[selectedTable];
				}
				return null;
			},
			getName: function(id) {
				return controller.getConnectionName(id);
			},
			getStyle: function(index, totalConnections, maximizeContrast) {
				var colorStyle = controller.getColorStyle();
				var colorData = utils.calculateColors(index, totalConnections, maximizeContrast);
				return {background: "hsl(" + colorData.angle + ", " + colorStyle.saturation + ", " + colorStyle.luminance + ")", color: colorData.color};
			},
			handleChildColumnChange: function(e) {
				var $this = $(e.target);
				if($this.is("a")) {
					this.selectedChildColumn = $this.text();
				}
			},
			handleChildTableChange: function(e) {
				var $this = $(e.target);
				if($this.is("a")) {
					this.selectedChildColumn = "Select Column";
					this.selectedChild = $this.text();
				}
			},
			handleCreateTableRelationship: function() {
				var o = {
					parentTable: this.selectedParent,
					parentJoinColumn: this.selectedParentColumn,
					childTable: this.selectedChild,
					childJoinColumn: this.selectedChildColumn,
					parentFields: [],
					childFields: []
				};
				var $fieldSelectors = $(".field-selectors");
				var $parentFields = $fieldSelectors.find(".parent-fields");
				var $childFields = $fieldSelectors.find(".child-fields");
				$parentFields.find(".check-box.is-on").each(function() {
					o.parentFields.push($(this).closest(".field").text().trim());
				});
				$childFields.find(".check-box.is-on").each(function() {
					o.childFields.push($(this).closest(".field").text().trim());
				});
				controller.createTableRelationship(o);
			},
			handleDataModelUpdate: function() {
				this.selectedParent = this.selectedChild = "Select Table";
				this.selectedChildColumn = this.selectedParentColumn = "Select Column";
				this.tables = controller.getTables(this.connections, this.selectedTable);
			},
			handleDeleteViewSetings: function(e) {
				controller.removeTableFieldData(this.selectedTable);
			},
			handleParentColumnChange: function(e) {
				var $this = $(e.target);
				if($this.is("a")) {
					this.selectedParentColumn = $this.text();
				}
			},
			handleParentTableChange: function(e) {
				var $this = $(e.target);
				if($this.is("a")) {
					this.selectedParentColumn = "Select Column";
					this.selectedParent = $this.text();
				}
			},
			handleSaveViewSettings: function(data) {
				controller.addTableFieldData(this.selectedTable, data);
			},
			handleSelectAll: function(e) {
				console.log("handle select all");
			},
			setConnections: function(data) {
				var a = [];
				var l = data.length;
				while(l--) {
					a.unshift(data[l].id);
				}
				this.connections = a;
				this.totalConnections = a.length;
				this.primeConnection = controller.getPrimeConnection();
				this.handleDataModelUpdate();
			},
			setMaximizeContrast: function(bool) {
				this.maximizeContrast = bool;
			},
			setSelectedTable: function(selectedTable) {
				this.selectedTable = selectedTable;
				this.viewParameters = controller.getViewParameters(selectedTable);
				this.handleDataModelUpdate();
			},
			showTableData: function(data) {
				if(this.viewParameters) {
					console.log(stripObservers(data), stripObservers(this.viewParameters));
				}
				if(data && data[0] && data[0].name) {
					this.fields = data[0].fields;
					this.tableData = data;
					this.selectedTable = data[0].name;
					this.renderRows = this._reduce(data, this.viewParameters);
				}
			},
			_reduce: function(tableData, viewData) {
				const a = [];
				if(tableData && viewData) {
					const o = {};
					var tableCount = tableData.length;
					//normalize object data (put rows together)
					for(var i = 0; i < tableCount; i++) {
						var content = tableData[i].content;
						var l2 = content.length;
						for(var i2 = 0; i2 < l2; i2++) {
							var row = content[i2];
							if(!o[row.primaryKey]) {
								o[row.primaryKey] = [];
							}
							o[row.primaryKey][i] = row;
						}
					}
					//mark matching rows (exclusions)
					for(var i in o) {
						var row = o[i];
						var l = row.length;
						while(l--) {
							if(row[l]) {
								var data = stripObservers(row[l].data);
								var l2 = viewData.selectedExclusionFields.length
								while(l2--) {
									delete data[viewData.selectedExclusionFields[l2]];
								}
								row[l].contentHash = md5(JSON.stringify(data));
							}
						}
					}
					//destructure back into an array
					var _isRowMatch = function(arr) {
						if(arr.length > 1) {
							var primeHash = arr[0] ? arr[0].rowHash : null;
							var l = arr.length;
							for(var i = 1; i < l; i++) {
								if(!arr[i] || arr[i].rowHash != primeHash) {
									return false;
								}
							}
						}
						return true;
					}
					for(var i in o) {
						if(!_isRowMatch(o[i])) {
							a.push(o[i]);
						}
					}
					//sort
					var l = viewData.selectedSortFields.length;
					if(l) {
						for(var i = 0; i < l; i++) {
							var column = viewData.selectedSortFields[i];
							var isDesc = viewData.sortOptions[column] == "desc";
							var returnValue = isDesc ? -1 : 1;
							a.sort(function(a, b) {
								if(a[0] && a[0].data && b[0] && b[0].data) {
									if(a[0].data[column] > b[0].data[column]) {
										return returnValue;
									} else if(a[0].data[column] < b[0].data[column]) {
										return returnValue * -1;
									}
									return 0;
								} else {
									return 1;
								}
							});
						}
					}
					//display fields (reduce)
					var _filter = function(data, filterFields) {
						var o = {};
						var l = filterFields.length;
						while(l--) {
							var column = filterFields[l];
							o[column] = data[column];
						}
						return o;
					}
					
					var l = a.length;
					while(l--) {
						var row = a[l];
						var l2 = row.length;
						while(l2--) {
							if(row[l2] && row[l2].data) {
								row[l2].displayData = _filter(row[l2].data, viewData.selectedDisplayFields);
							}
						}
					}
				}
				return a;
			}
		}
	});
})();
