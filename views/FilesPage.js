(function() {
	var componentName = 'files-page';
	var s = `
		<div class="files-page container-fluid">
			<div class="row">
				<div class="col-xs-12 file-listings">
					<files-nav-bar></files-nav-bar>
					<table class="file-listing-table">
						<tr>
							<td v-for="(conId, index) in connections">
								<file-listing v-bind:files="files[conId]" v-bind:primeFiles="getPrimeFiles()" v-bind:allFiles="files.allFiles" v-bind:connectionName="getName(conId)" v-bind:dataConnectionId="conId" v-bind:dataIndex="index" v-bind:dataConnectionCount="totalConnections"></file-listing>
							</td>
						</tr>
					</table>
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
				totalConnections: 0,
				primeId: null
			}
		},
		methods: {
			getPrimeFiles: function() {
				var primeId = this.primeId = controller.getPrimeId();
				if(primeId && this.files[primeId]) {
					return this.files[primeId];
				}
				return [];
			},
			getName: function(id) {
				return controller.getConnectionName(id);
			},
			handleFileModelUpdate: function() {
				this.files = controller.getFiles(this.connections, this.path);
			},
			setConnections: function(data) {
				if(data) {
					var a = [];
					var l = data.length;
					while(l--) {
						a.unshift(data[l].id);
					}
					this.connections = a;
					this.totalConnections = a.length;
					this.handleFileModelUpdate();
				}
			},
			setPath: function(path) {
				this.path = path;
				this.handleFileModelUpdate();
			}
		}
	});
})();
