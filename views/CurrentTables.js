(function() {
	var componentName = 'current-tables';
	var s = `
		<div class="current-tables container-fluid">
			<div class="row">
				<div v-show="this.relations && this.relations.length" class="col-xs-12 bare-container related-tables">
					<h2>Related Tables</h2>
					<div v-on:click="handleViewRelation(relation.id)" v-for="relation in relations" class="relation">
						<span v-on:click="handleRemove" v-bind:data-id="relation.id" class="glyphicon glyphicon-remove pull-right" />
						<div class="related-table"><i class="fas fa-table glyphicon" /> {{relation.parentTable}}</div>
						<div class="arrow-connector" />
						<div class="related-table"><i class="fas fa-arrow-right glyphicon" /><i class="fas fa-table glyphicon" /> {{relation.childTable}}</div>
					</div>
					<horizontal-rule />
				</div>
				<div class="col-xs-12 bare-container normal-tables">
					<h2>All Tables</h2>
					<ul class="tables">
						<database-table v-for="table in tables" v-on:table-click="handleTableClick" v-bind:table="table" />
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
				this.relations = this._sortRelations(controller.getRelations());
			},
			handleRemove: function(e) {
				e.stopPropagation();
				var id = $(e.target).attr("data-id");
				if(id) {
					controller.removeRelation(id);
				}
			},
			handleTableClick: function(tableName) {
				controller.viewTable(tableName);
			},
			handleViewRelation: function(key) {
				controller.viewRelation(key);
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
			}
		}
	});
})();
