(function() {
	var componentName = 'current-tables';
	var s = `
		<div class="current-tables container-fluid">
			<div class="row">
				<div class="col-xs-12 bare-container">
					<h2>Tables</h2>
					<ul class="tables">
						<database-table v-for="table in tables" v-on:table-click="handleTableClick" v-bind:table="table"></database-table>
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
				selectedTable: ''
			}
		},
		methods: {
			handleDataModelUpdate: function() {
				this.tables = controller.getTables(this.connections, this.selectedTable);
			},
			handleTableClick: function(tableName) {
				console.log(tableName);
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
			}
		}
	});
})();
