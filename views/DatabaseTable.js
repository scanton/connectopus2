(function() {
	var componentName = 'database-table';
	var s = `
		<li title="Browse Table" v-on:click="handleClick(table[0].table)" v-bind:class="{ selected: selectedTable == table[0].table }" class="database-table container-fluid" v-bind:data-path="table.path">
			<i class="fas fa-table glyphicon"></i> 
			{{table[0].table}}
			<i v-show="hasFieldData" class="fas fa-filter glyphicon"></i>
		</li>
	`;
	
	Vue.component(componentName, {
		created: function() {
			viewController.registerView(componentName, this);
		},
		computed: {
			hasFieldData: function() {
				var primeCon = controller.getPrimeConnection();
				if(this.table && primeCon) {
					var tableName = this.table[0].table;
					return Boolean(primeCon.tableViews[tableName]);
				}
				return false;
			}
		},
		props: ['table', 'selectedTable', 'fieldData'],
		template: s,
		data: function() {
			return {}
		},
		methods: {
			handleClick: function(tableName) {
				this.$emit('table-click', tableName);
			}
		}
	});
})();
