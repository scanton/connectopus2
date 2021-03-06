(function() {
	var componentName = 'data-page';
	var s = `
		<div class="data-page container-fluid">
			<div class="row">
				<div class="col-xs-12">
					<data-nav-bar 
						v-bind:rowsAreSelected="selectedRows.length" 
						v-bind:showRelationsButton="selectedTable != '' && !isViewSettingsVisible" 
						v-on:toggle-view-settings="handleToggleViewSettings"
						v-on:sync-selected-rows="handleSyncSelectedRows"
					></data-nav-bar>
				</div>
			</div>
			<div v-show="fields.length && isViewSettingsVisible" class="row">
				<div class="col-xs-12">
					<data-fields 
						v-on:save-vew-settings="handleSaveViewSettings"
						v-on:delete-view-settings="handleDeleteViewSetings"
						v-on:toggle-view-settings="handleToggleViewSettings"
						v-bind:fields="fields"
						v-bind:fieldData="getFieldData(selectedTable)"
					></data-fields>
				</div>
			</div>
			<div v-show="selectedTable != ''" class="row main-data-container">
				<div class="col-xs-12 bare-container data-listing">
					<table v-on:click="handleClick" class="data-listing-table">
						<tr>
							<th v-bind:colspan="columnLength" class="connection-name" v-for="(conId, index) in connections" v-bind:style="getStyle(index, totalConnections, maximizeContrast)">
								<span class="pull-left" v-if="index == 0"><input class="select-all-checkbox" v-on:click="handleSelectAll" type="checkbox" /></span>
								{{getName(conId)}}
							</th>
						</tr>
						<tr v-if="viewParameters && viewParameters.selectedDisplayFields" v-html="_renderColumnHeadings(viewParameters.selectedDisplayFields, connections, totalConnections, maximizeContrast)"></tr>
						<tr v-for="row in renderRows" v-html="_renderColumns(row, viewParameters.selectedDisplayFields, connections, totalConnections, maximizeContrast)"></tr>
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
				renderRows: [],
				isViewSettingsVisible: true,
				columnLength: 1,
				selectedRows: []
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
			handleClick: function(e) {
				var $this = $(e.target);
				if($this.hasClass("primary-key-checkbox")) {
					this._countSelectedRows();
				} else if($this.hasClass("select-all-of-type")) {
					var isChecked = $this.is(":checked");
					var text = $this.closest("td").text();
					$(".primary-key-checkbox").each(function() {
						var $t = $(this);
						var val = $t.closest("td").text();
						if(val == text) {
							$t.closest("td").find("input[type='checkbox']").prop("checked", isChecked);
						}
					});
					this._countSelectedRows();
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
				var isChecked = $(e.target).is(":checked");
				$(".primary-key-checkbox").prop("checked", isChecked);
				var a = [];
				$(".primary-key-checkbox:checked").each(function() {
					a.push($(this).attr("data-key"));
				});
				this.selectedRows = a;
			},
			handleSyncSelectedRows: function() {
				controller.syncSelectedRows(this.selectedRows, this.selectedTable, this.primaryKeyName);
			},
			handleToggleViewSettings: function(e) {
				this.isViewSettingsVisible = !this.isViewSettingsVisible;
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
				if(this.viewParameters && this.viewParameters.selectedDisplayFields) {
					this.columnLength = this.viewParameters.selectedDisplayFields.length;
				} else {
					this.columnLength = 1;
				}
				this.handleDataModelUpdate();
			},
			showTableData: function(data) {
				if(data && data[0] && data[0].name) {
					this.primaryKeyName = data[0].fields[0].name;
					this.fields = data[0].fields;
					this.tableData = data;
					this.selectedTable = data[0].name;
					this.renderRows = this._reduce(data, this.viewParameters);
				}
			},
			_countSelectedRows: function() {
				var a = [];
				$(".primary-key-checkbox:checked").each(function() {
					a.push($(this).attr("data-key"));
				});
				this.selectedRows = a;
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
			},
			_renderColumnHeadings: function(selectedDisplayFields, connections, totalConnections, maximizeContrast) {
				var s = '';
				var l1 = connections.length;
				for(var i1 = 0; i1 < l1; i1++) {
					var styleObject = this.getStyle(i1, totalConnections, maximizeContrast);
					var style = '';
					for(var index in styleObject) {
						style += index + ": " + styleObject[index] + "; ";
					}
					var l2 = selectedDisplayFields.length;
					for(var i2 = 0; i2 < l2; i2++) {
						s += '<th class="column-names data-compare-listing" style="' + style + '">' + selectedDisplayFields[i2] + '</th>';
					}
				}
				return s;
			},
			_renderColumns: function(row, selectedDisplayFields, connections, totalConnections, maximizeContrast) {
				var s = '';
				var l1 = connections.length;
				for(var i1 = 0; i1 < l1; i1++) {
					var styleObject = this.getStyle(i1, totalConnections, maximizeContrast);
					var style = '';
					for(var index in styleObject) {
						style += index + ": " + styleObject[index] + "; ";
					}
					var l2 = selectedDisplayFields.length;
					for(var i2 = 0; i2 < l2; i2++) {
						if(row[i1] && row[i1].data) {
							var checkbox, selectAllOfTypeBox;
							if(i1 == 0 && i2 == 0) {
								checkbox = '<input class="primary-key-checkbox" data-key="' + row[i1].primaryKey + '" type="checkbox" />&nbsp;';
								selectAllOfTypeBox = '<input type="checkbox" class="select-all-of-type pull-right" />';	
							} else {
								checkbox = '';
								selectAllOfTypeBox = '';	
							}
							s += '<td class="column-value data-compare-listing" style="' + style + '"> ' + selectAllOfTypeBox + checkbox + row[i1].data[selectedDisplayFields[i2]] + '</td>';
						} else {
							s += '<td class="column-value data-compare-listing" style="' + style + '"></td>';
						}
					}
				}
				return s;
			}
		}
	});
})();
