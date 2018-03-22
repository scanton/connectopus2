(function() {
	var componentName = 'folder';
	var s = `
		<li draggable="true" v-on:drag="drag" v-on:drop="drop" v-on:dragleave="dragLeave" v-on:dragover="allowDrop" class="folder" v-bind:class="{ 'is-open': isOpen, 'is-drag-over': isDragOver, 'selected': selectedFolder == name }">
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
				isOpen: false,
				isDragOver: false,
				selectedFolder: null
			}
		},
		methods: {
			clearSelected: function(e) {
				controller.setDragFolderName(null);
			},
			allowDrop: function(e) {
				e.preventDefault();
				this.isDragOver = true;
			},
			drag: function(e) {
				controller.setDragFolderName($(e.target).find(".folder-name").text());
			},
			dragEnd: function(e) {
				controller.handleDragFolderEnd();
				e.preventDefault();
				this.isDragOver = false;
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
				this.isDragOver = false;
			},
			dragLeave: function(e) {
				e.preventDefault();
				this.isDragOver = false;
			},
			setSelectedFolder: function(name) {
				this.selectedFolder = name;
			},
			toggleOpen: function(e) {
				e.preventDefault();
				this.isOpen = !this.isOpen;
				$(e.target).closest(".folder").find(".connections").slideToggle();
				if(this.selectedFolder == this.name) {
					controller.setDragFolderName(null);
				} else {
					controller.setDragFolderName(this.name);
				}
			}
		}
	});
})();