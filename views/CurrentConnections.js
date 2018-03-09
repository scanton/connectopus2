(function() {
	var componentName = 'current-connections';
	var s = `
		<div class="current-connections container-fluid scroll-overflow">
			<div class="row ">
				<div class="col-xs-12">
					<h2>Connections</h2>
					<ul class="folders">
						<folder v-for="folder in folders" v-bind:name="folder.name" v-bind:connections="folder.servers"></folder>
					</ul>
					<hr />
					<ul class="connections">
						<connection v-for="connection in connections" v-bind:name="connection.name" v-bind:id="connection.id"></connection>
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
				folders: [],
				connections: []
			}
		},
		methods: {
			handleDeleteConnection: function(e) {
				e.preventDefault();
				console.log("delete connection");
			},
			handleAddFolder: function(e) {
				e.preventDefault();
				console.log("add folder");
			},
			handleAddConnection: function(e) {
				e.preventDefault();
				console.log("add connection");
			},
			setFolders: function(data) {
				this.folders = data;
			},
			setConnections: function(data) {
				this.connections = data;
			}
		}
	});
})();

//****************************** folder **************************************

(function() {
	var componentName = 'folder';
	var s = `
		<li class="folder" v-bind:class="{ 'is-open': isOpen }">
			<span class="label-container" v-on:click="toggleOpen">
				<span><span v-show="!isOpen" class="glyphicon glyphicon-triangle-right"></span>
				<span><span v-show="isOpen" class="glyphicon glyphicon-triangle-bottom"></span></span>
				<span><span v-show="!isOpen" class="glyphicon glyphicon-folder-close"></span></span>
				<span><span v-show="isOpen" class="glyphicon glyphicon-folder-open"></span></span>
				<span class="folder-name">{{name}}</span>
			</span>
			<ul class="connections" style="display: none;">
				<connection v-for="connection in connections" v-bind:name="connection.name" v-bind:id="connection.id"></connection>
			</ul>
		</li>
	`;
	
	Vue.component(componentName, {
		created: function() {
			viewController.registerView(componentName, this);
		},
		template: s,
		props: ['name', 'connections'],
		data: function() {
			return {
				connections: {},
				isOpen: false
			}
		},
		methods: {
			toggleOpen: function(e) {
				e.preventDefault();
				this.isOpen = !this.isOpen;
				$(e.target).closest(".folder").find(".connections").slideToggle();
			}
		}
	});
})();

//****************************** connection **************************************

(function() {
	var componentName = 'connection';
	var s = `
		<li class="connection" v-bind:class="{selected: id == selectedConnection, connected: isConnected, error: isError, pending: isPending}" v-bind:data-id="id" v-on:click="handleViewConnection">
			<span class="glyphicon glyphicon-globe"></span>
			<span class="connection-name">{{name}}</span>
			<span class="quick-connection-link" v-on:click="handleConnect">
				<span class="glyphicon glyphicon-record" title="connect"></span>
			</span>
		</li>
	`;
	
	Vue.component(componentName, {
		created: function() {
			viewController.registerView(componentName, this);
		},
		template: s,
		props: ['name', 'id'],
		data: function() {
			return {
				connection: {},
				selectedConnection: null,
				isConnected: false,
				isError: false,
				isPending: false
			}
		},
		methods: {
			handleConnect: function(e) {
				e.preventDefault();
				e.stopPropagation();
				controller.connectTo($(e.target).closest(".connection").attr("id"));
			},
			handleViewConnection: function(e) {
				e.preventDefault();
				e.stopPropagation();
				controller.showConnectionDetail($(e.target).closest(".connection").attr("data-id"));
			},
			setSelectedConnection: function(id) {
				this.selectedConnection = id;
			}
		}
	});
})();
