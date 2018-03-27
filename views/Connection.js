(function() {
	var componentName = 'connection';
	var s = `
		<li v-on:click="handleViewConnection" draggable="true" v-on:drag="drag" v-on:drop="drop" v-on:dragend="dragEnd" v-on:dragover="allowDrop" v-on:dragleave="dragLeave" class="connection" v-bind:class="[connectionStatus, { 'is-prime': isPrime , 'is-drag-over': isDragOver, selected: id == selectedConnection, connected: isConnected, error: isError, pending: isPending}]" v-bind:data-id="id">
			<span v-show="!isPrime" class="glyphicon glyphicon-globe"></span>
			<span v-show="isPrime" class="glyphicon glyphicon-star"></span>
			<span class="connection-name">{{name}}</span>
			<span v-bind:class="connectionStatus" class="status-icon pull-right">
				<span v-show="this.connectionStatus != ''" class="highlight"></span>
			</span>
			<span v-show="this.liveConnection.id == null" class="quick-connection-link" v-on:click="handleConnect">
				Connect <span class="glyphicon glyphicon-record" title="connect"></span>
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
				isDragOver: false,
				liveConnection: {},
				connectionStatus: '',
				isPrime: false
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
				if(controller.isDraggingConnection) {
					e.preventDefault();
					this.isDragOver = true;
				}
			},
			dragLeave: function(e) {
				e.preventDefault();
				this.isDragOver = false;
			},
			handleConnect: function(e) {
				e.preventDefault();
				e.stopPropagation();
				this.handleViewConnection(e);
				controller.connectTo($(e.target).closest(".connection").attr("data-id"));
			},
			handleViewConnection: function(e) {
				e.preventDefault();
				e.stopPropagation();
				controller.showConnectionDetail($(e.target).closest(".connection").attr("data-id"));
			},
			setSelectedConnection: function(id) {
				this.selectedConnection = id;
			},
			setConnectionStatus: function(data) {
				if(data && data[0]) {
					this.isPrime = data[0].id == this.id;
					var l = data.length;
					while(l--) {
						if(data[l].id == this.id) {
							this.liveConnection = data[l];
							this.connectionStatus = data[l].status;
							return;
						}
					}
				}
				this.isPrime = false;
				this.liveConnection = {};
				this.connectionStatus = "";
			}
		}
	});
})();