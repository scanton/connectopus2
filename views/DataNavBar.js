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
					<!--
					<button v-show="showRelationsButton" v-on:click="handleCreateTableRelationship" class="btn btn-default" title="Create Table Relationship">
						<span class="glyphicon glyphicon-list-alt"></span> Create Table Relationship
					</button>
					-->
				</div>
			</div>
		</div>
	`;
	
	Vue.component(componentName, {
		created: function() {
			viewController.registerView(componentName, this);
		},
		template: s,
		props: ["showRelationsButton"],
		data: function() {
			return {
				rowsAreSelected: false
			}
		},
		methods: {
			handleCreateTableRelationship: function(e) {
				controller.showCreateTableRelationshipView();
			},
			handleRefreshView: function(e) {
				console.log("refresh data view");
			},
			handleSyncData: function(e) {
				e.preventDefault();
				controller.syncSelectedFiles();
			}
		}
	});
})();
