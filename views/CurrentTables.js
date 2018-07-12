(function() {
	var componentName = 'current-tables';
	var s = `
		<div class="current-tables container-fluid">
			<div class="row">
				<div class="col-xs-12 bare-container normal-tables">
					<h2>All Tables</h2>
					<ul class="tables">
						<database-table 
							v-for="table in tables" 
							v-on:table-click="handleTableClick" 
							v-bind:table="table" 
							v-bind:selectedTable="selectedTable" 
							v-bind:fieldData="getFieldData(table)"
						/>
					</ul>
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
				selectedTable: '',
				//relations: null,
				primeConnection: null
			}
		},
		methods: {
			getFieldData: function(table) {
				if(table && table[0] && this.primeConnection && this.primeConnection.tableViews) {
					var tableName = table[0].table;
					return this.primeConnection.tableViews[tableName];
				}
				return null;
			},
			handleDataModelUpdate: function() {
				this.tables = controller.getTables(this.connections, this.selectedTable);
				//this.relations = this._sortRelations(controller.getRelations());
				this.primeConnection = controller.getPrimeConnection();
			},
			handleTableClick: function(tableName) {
				controller.viewTable(tableName);
			},
			setConnections: function(data) {
				var a = [];
				var l = data.length;
				while(l--) {
					a.unshift(data[l].id);
				}
				this.connections = a;
				this.primeConnection = controller.getPrimeConnection();
				this.handleDataModelUpdate();
			},
			setSelectedTable: function(selectedTable) {
				this.selectedTable = selectedTable;
				this.handleDataModelUpdate();
			}/*,
			_sortRelations: function(rel) {
				var r;
				var a = [];
				for(var i in rel) {
					r = rel[i];
					r.id = i;
					a.push(r);
				}
				a.sort((val1, val2) => {
					if(val1.parentTable > val2.parentTable) {
						return 1;
					} else if(val1.parentTable < val2.parentTable) {
						return -1;
					}
					if(val1.childTable > val2.childTable) {
						return 1;
					} else if(val1.childTable < val2.childTable) {
						return -1;
					}
					return 0;
				});
				return a;
			}*/
		}
	});
})();
