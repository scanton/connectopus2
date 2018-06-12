(function() {
	var componentName = 'current-tables';
	var s = `
		<div class="current-tables container-fluid">
			<div class="row">
				<div v-show="this.relations" class="col-xs-12 bare-container related-tables">
					<h2>Related Tables</h2>
					<div v-on:click="handleViewRelation(key)" v-for="(relation, key, index) in relations" class="relation">
						<div class="related-table"><i class="fas fa-table glyphicon"></i> {{relation.parentTable}}</div>
						<div class="related-table"><i class="fas fa-arrow-right glyphicon"></i><i class="fas fa-table glyphicon"></i> {{relation.childTable}}</div>
					</div>
					<horizontal-rule></horizontal-rule>
				</div>
				<div class="col-xs-12 bare-container normal-tables">
					<h2>All Tables</h2>
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
				selectedTable: '',
				relations: null
			}
		},
		methods: {
			handleDataModelUpdate: function() {
				this.tables = controller.getTables(this.connections, this.selectedTable);
				this.relations = controller.getRelations();
			},
			handleTableClick: function(tableName) {
				console.log("View Table", tableName);
			},
			handleViewRelation: function(key) {
				console.log("View Relation", key);
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
