(function() {
	var componentName = 'data-page';
	var s = `
		<div class="data-page container-fluid">
			<div class="row">
				<div class="col-xs-12">
					<data-nav-bar v-bind:showRelationsButton="selectedTable != ''"></data-nav-bar>
				</div>
			</div>
			<div class="row">
				<div class="col-xs-12">
					<data-fields v-bind:fields="fields"></data-fields>
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
						<!--
						<tr v-for="file in files.allFiles">
							<td v-bind:class="{'row-is-in-sync': isRowInSync(file)}" class="file-compare-listing" v-for="(conId, index) in connections" v-bind:style="getStyle(index, totalConnections, maximizeContrast)">
								<file-compare v-bind:conId="conId" v-bind:index="index" v-bind:totalConnections="totalConnections" v-bind:primeFile="getPrimeFile(file.name)" v-bind:compareFile="getFile(file.name, conId)"></file-compare>
							</td>
						</tr>
						-->
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
				totalConnections: 0
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
				this.handleDataModelUpdate();
			},
			setMaximizeContrast: function(bool) {
				this.maximizeContrast = bool;
			},
			setSelectedTable: function(selectedTable) {
				this.selectedTable = selectedTable;
				this.handleDataModelUpdate();
			},
			showTableData: function(data) {
				console.log(data);
				if(data && data[0] && data[0].name) {
					this.fields = data[0].fields;
					this.tableData = data;
					this.selectedTable = data[0].name;
				}
			}
		}
	});
})();
