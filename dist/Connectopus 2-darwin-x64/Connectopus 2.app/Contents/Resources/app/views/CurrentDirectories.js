(function() {
	var componentName = 'current-directories';
	var s = `
		<div class="current-directories container-fluid">
			<div class="row">
				<div class="col-xs-12 bare-container">
					<h2>Directories</h2>
					<ul class="directories">
						<directory v-for="directory in directories" v-bind:directory="directory"></directory>
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
				connections: [],
				directories: [],
				path: ''
			}
		},
		methods: {
			handleFileModelUpdate: function() {
				this.directories = controller.getDirectories(this.connections, this.path);
			},
			setConnections: function(data) {
				var a = [];
				var l = data.length;
				while(l--) {
					a.unshift(data[l].id);
				}
				this.connections = a;
				this.handleFileModelUpdate();
				//this.directories = controller.getDirectories(this.connections, this.path);
			},
			setPath: function(path) {
				this.path = path;
				this.handleFileModelUpdate();
				//this.directories = controller.getDirectories(this.connections, this.path);
			}
		}
	});
})();
