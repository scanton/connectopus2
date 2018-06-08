(function() {
	var componentName = 'data-page';
	var s = `
		<div class="data-page container-fluid">
			<div class="row">
				<div class="col-xs-12">
					<h1>Data View</h1>

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
