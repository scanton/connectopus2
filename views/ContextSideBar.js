(function() {
	var componentName = 'context-side-bar';
	var s = `
		<div class="context-side-bar side-bar">
			<current-connections></current-connections>
			
			<div class="foot-toolbar">
				<button v-show="selectedConnection" v-on:click="handleDeleteConnection" class="btn btn-danger" title="Delete Connection">
					<span class="glyphicon glyphicon-trash"></span>
				</button>
				<button v-on:click="handleAddFolder" class="btn btn-default pull-right" title="Add Folder">
					<span class="glyphicon glyphicon-folder-close"></span>
					<span class="glyphicon glyphicon-plus inverse-small"></span>
				</button>
				<button v-on:click="handleAddConnection" class="btn btn-default pull-right" title="Add Connection">
					<span class="glyphicon glyphicon-plus"></span>
				</button>
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
				selectedConnection: null
			}
		},
		methods: {
			handleDeleteConnection: function(e) {
				e.preventDefault();
				controller.deleteConnection(this.selectedConnection);
			},
			handleAddFolder: function(e) {
				e.preventDefault();
				console.log("add folder");
			},
			handleAddConnection: function(e) {
				e.preventDefault();
				controller.showAddConnection();
			},
			setFolders: function(data) {
				this.folders = data;
			},
			setConnections: function(data) {
				this.connections = data;
			},
			setSelectedConnection: function(id) {
				this.selectedConnection = id;
			}
		}
	});
})();
