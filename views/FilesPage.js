(function() {
	var componentName = 'files-page';
	var s = `
		<div class="files-page container-fluid">
			<div class="row">
				<div class="col-xs-12">
					<file-listing v-for="(conId, index) in connections" v-bind:dataConnectionId="conId" v-bind:files="files" v-bind:dataIndex="index" v-bind:dataConnectionCount="totalConnections"></file-listing>
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
				files: [],
				path: '',
				totalConnections: 0
			}
		},
		methods: {
			handleFileModelUpdate: function() {
				this.files = controller.getFiles(this.connections, this.path);
			},
			setConnections: function(data) {
				var a = [];
				var l = data.length;
				while(l--) {
					a.unshift(data[l].id);
				}
				this.connections = a;
				this.totalConnections = a.length;
				this.handleFileModelUpdate();
			},
			setPath: function(path) {
				this.path = path;
				this.handleFileModelUpdate();
			}
		}
	});
})();
