(function() {
	var componentName = 'current-connections';
	var s = `
		<div class="current-connections container-fluid">
			<div class="row">
				<div class="col-xs-12 bare-container">
					<h2>Connections</h2>
					<ul class="folders">
						<li v-show="isAddFolderVisible">
							<input v-on:keydown="handleKeyDown" class="add-folder-name-input" type="text" name="folder-name" placeholder="Folder Name" />
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
				var input = $(".add-folder-name-input");
				controller.createConfigFolder(input.val());
				this.isAddFolderVisible = false;
				input.val("");
			},
			handleKeyDown: function(e) {
				if(e.keyCode == 13) {
					this.handleCreateFolder(e);
				}
			},
			setFolders: function(data) {
				this.folders = data;
			},
			setConnections: function(data) {
				this.connections = data;
			},
			showAddFolder: function() {
				this.isAddFolderVisible = true;
				setTimeout(function() {
					$(".add-folder-name-input").focus();
				}, 50);
			}
		}
	});
})();

//****************************** folder **************************************



//****************************** connection **************************************


