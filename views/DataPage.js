(function() {
	var componentName = 'data-page';
	var s = `
		<div class="data-page container-fluid">
			<div class="row">
				<div class="col-xs-12">
					<data-nav-bar v-bind:showRelationsButton="selectedTable != ''"></data-nav-bar>
				</div>
			</div>
			<div v-show="selectedTable != ''" class="row main-data-container">
				<div class="col-xs-12">
					<h2>{{selectedTable}}</h2>
				</div>
			</div>
			<!--
			<div v-show="selectedTable == ''" class="row main-data-container">
				<div class="col-xs-12">
					<h2>Data Table Relationships</h2>
					<p>You can create parent/child relationships between tables to manage data sync among inter-related tables.</p>
					<p>Select the two tables you would like to relate in the data sync view, and choose the columns that should join these tables.</p>
				</div>
				<div class="col-xs-12 col-sm-6">
					<div class="input-group">
						<span class="input-group-addon">Parent Table</span>
						<div class="dropdown table-selector">
							<button class="btn btn-default dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
								{{selectedParent}}
								<span class="caret"></span>
							</button>
							<ul v-on:click="handleParentTableChange" class="dropdown-menu">
								<li v-for="table in tables"><a href="#">{{ table[0].table }}</a></li>
							</ul>
						</div>
					</div>
				</div>
				<div class="col-xs-12 col-sm-6">
					<div class="input-group">
						<span class="input-group-addon">Child Table</span>
						<div class="dropdown table-selector">
							<button class="btn btn-default dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
								{{selectedChild}}
								<span class="caret"></span>
							</button>
							<ul v-on:click="handleChildTableChange" class="dropdown-menu">
								<li v-for="table in tables"><a href="#">{{ table[0].table }}</a></li>
							</ul>
						</div>
					</div>
				</div>
				<div v-show="selectedParent != 'Select Table' && selectedChild != 'Select Table'" class="column-selectors">
					<div class="col-xs-12 text-center">
						<horizontal-rule></horizontal-rule>
						<h3>Join on These Columns</h3>
					</div>
					<div class="col-xs-12 col-sm-6">
						<div class="dropdown column-selector">
							<div class="input-group">
								<span class="input-group-addon">Parent Key</span>
								<div class="dropdown table-selector">
									<button class="btn btn-default dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
										{{selectedParentColumn}}
										<span class="caret"></span>
									</button>
									<ul v-on:click="handleParentColumnChange" class="dropdown-menu">
										<li v-for="column in getColumns(selectedParent)"><a href="#">{{ column.column }}</a></li>
									</ul>
								</div>
							</div>
						</div>
					</div>
					<div class="col-xs-12 col-sm-6">
						<div class="dropdown column-selector">
							<div class="input-group">
								<span class="input-group-addon">Child Key</span>
								<div class="dropdown table-selector">
									<button class="btn btn-default dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
										{{selectedChildColumn}}
										<span class="caret"></span>
									</button>
									<ul v-on:click="handleChildColumnChange" class="dropdown-menu">
										<li v-for="column in getColumns(selectedChild)"><a href="#">{{ column.column }}</a></li>
									</ul>
								</div>
							</div>
						</div>
					</div>
					<div v-show="selectedParentColumn != 'Select Column' && selectedChildColumn != 'Select Column'" class="field-selectors">
						<div class="col-xs-12 text-center">
							<horizontal-rule></horizontal-rule>
							<h3>Display These Fields</h3>
						</div>
						<div class="col-xs-12 col-sm-6 field-list">
							<div class="field-list-frame parent-fields">
								<h4>{{selectedParent}} fields:</h4>
								<field-selector v-bind:fields="getColumns(selectedParent)"></field-selector>
							</div>
						</div>
						<div class="col-xs-12 col-sm-6 field-list">
							<div class="field-list-frame child-fields">
								<h4>{{selectedChild}} fields:</h4>
								<field-selector v-bind:fields="getColumns(selectedChild)"></field-selector>
							</div>
						</div>
						<button v-on:click="handleCreateTableRelationship" class="btn btn-success pull-right">Create Table Relationship</button>
						<div class="clear"></div>
					</div>
				</div>
			</div>
			-->
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
				selectedTable: '',
				selectedParent: 'Select Table',
				selectedChild: 'Select Table',
				selectedParentColumn: 'Select Column',
				selectedChildColumn: 'Select Column'
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
			setConnections: function(data) {
				var a = [];
				var l = data.length;
				while(l--) {
					a.unshift(data[l].id);
				}
				this.connections = a;
				this.handleDataModelUpdate();
			},
			setSelectedTable: function(selectedTable) {
				this.selectedTable = selectedTable;
				this.handleDataModelUpdate();
			},
			showTableData: function(data) {
				console.log(data);
				if(data && data[0] && data[0].name) {
					this.tableData = data;
					this.selectedTable = data[0].name;
				}
			}
		}
	});
})();
