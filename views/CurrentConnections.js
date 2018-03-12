(function() {
	var componentName = 'current-connections';
	var s = `
		<div class="current-connections container-fluid scroll-overflow">
			<div class="row ">
				<div class="col-xs-12">
					<h2>Connections</h2>
					<ul class="folders">
						<li v-show="isAddFolderVisible">
							<input type="text" name="folder-name" placeholder="Folder Name" />
							<button v-on:click="handleCreateFolder" class="btn btn-success">Add Folder</button>
						</li>
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
				connections: [],
				isAddFolderVisible: false
			}
		},
		methods: {
			handleCreateFolder: function(e) {
				e.preventDefault();
				controller.createConfigFolder($(e.target).closest("li").find("input").val());
				this.isAddFolderVisible = false;
			},
			setFolders: function(data) {
				this.folders = data;
			},
			setConnections: function(data) {
				this.connections = data;
			},
			showAddFolder: function() {
				this.isAddFolderVisible = true;
			}
		}
	});
})();

//****************************** folder **************************************

(function() {
	var componentName = 'folder';
	var s = `
		<li draggable="true" v-on:drag="drag" v-on:drop="drop" v-on:dragover="allowDrop" class="folder" v-bind:class="{ 'is-open': isOpen }">
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
			allowDrop: function(e) {
				e.preventDefault();

			},
			drag: function(e) {
				controller.setDragFolderName($(e.target).find(".folder-name").text());
			},
			dragEnd: function(e) {
				controller.handleDragFolderEnd();
				e.preventDefault();
			},
			drop: function(e) {
				var name = '';
				var $target = $(e.target);
				if($target.find(".folder-name").text()) {
					name = $target.find(".folder-name").text();
				} else {
					name = $target.closest("li").find(".folder-name").text();
				}
				var type = '';
				if(controller.isDraggingConnection) {
					type = 'connection';
				} else if(controller.isDraggingFolder) {
					type = 'folder';
				}
				
				if(type == 'connection' && name) {
					controller.moveConnectionToFolder(name);
				} else if(type = 'folder' && name) {
					controller.moveFolderTo(name);
				} else {
					console.error("invalid name/type", name, type);
				}
				
			},
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
		<li draggable="true" v-on:drag="drag" v-on:drop="drop" v-on:dragend="dragEnd" v-on:dragover="allowDrop" v-on:dragleave="dragLeave" class="connection" v-bind:class="{'is-drag-over': isDragOver, selected: id == selectedConnection, connected: isConnected, error: isError, pending: isPending}" v-bind:data-id="id" v-on:click="handleViewConnection">
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
				isPending: false,
				isDragOver: false
			}
		},
		methods: {
			drag: function(e) {
				e.preventDefault();
				var $target = $(e.target);
				if($target.attr("data-id")) {
					controller.setDragId($target.attr("data-id"));
				} else {
					controller.setDragId($target.closest("li").attr("data-id"));
				}
			},
			dragEnd: function(e) {
				controller.handleDragConnectionEnd();
				e.preventDefault();
				this.isDragOver = false;
			},
			drop: function(e) {
				e.preventDefault();
				var $target = $(e.target);
				if($target.attr("data-id")) {
					var dropId = $target.attr("data-id");
				} else {
					var dropId = $target.closest("li").attr("data-id");
				}
				if(dropId) {
					controller.moveConnectionTo(dropId);
				}
				this.isDragOver = false;
			},
			allowDrop: function(e) {
				e.preventDefault();
				this.isDragOver = true;
			},
			dragLeave: function(e) {
				e.preventDefault();
				this.isDragOver = false;
			},
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
