(function() {
	var componentName = 'data-nav-bar';
	var s = `
		<div class="data-nav-bar container-fluid">
			<div class="row">
				<div class="col-xs-12">
					<button v-on:click="handleSyncData" v-show="rowsAreSelected" class="btn btn-warning pull-right" title="Sync Selected Data Rows">
						<span class="glyphicon glyphicon-export"></span> Sync Selected Rows
					</button>
					<button v-on:click="handleRefreshView" class="btn btn-default pull-right" title="Refresh View">
						<span class="glyphicon glyphicon-refresh"></span>
					</button>
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
				rowsAreSelected: false
			}
		},
		methods: {
			handleSyncData: function(e) {
				e.preventDefault();
				controller.syncSelectedFiles();
			},
			handleRefreshView: function(e) {
				console.log("refresh data view");
			}
		}
	});
})();
