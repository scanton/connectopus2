(function() {
	var componentName = 'file-listing';
	var s = `
		<div class="file-listing container-fluid" v-bind:style="getStyle()">
			<div class="row">
				<div class="col-xs-12">
					<div class="file" v-for="file in files" v-bind:data-path="file.path" v-bind:data-md5="file.md5">{{file.name}}</div>
				</div>
			</div>
		</div>
	`;
	
	Vue.component(componentName, {
		created: function() {
			viewController.registerView(componentName, this);
			this.colorData = utils.calculateColors(this.dataIndex, this.dataConnectionCount, this.maximizeContrast);
			this.maximizeContrast = controller.getSettings().maximizeContrast;
		},
		props: ["dataConnectionCount", "dataIndex", "files", "dataConnectionId"],
		template: s,
		data: function() {
			return {
				colorData: null,
				maximizeContrast: null
			}
		},
		methods: {
			getStyle: function() {
				return {background: "hsl(" + this.colorData.angle + ", 67%, 60%)", color: this.colorData.color};
			},
			setMaximizeContrast: function(bool) {
				this.maximizeContrast = bool;
				this.colorData = utils.calculateColors(this.dataIndex, this.dataConnectionCount, bool);
			},
			setConnections: function(data) {
				this.dataConnectionCount = data.length;
				this.colorData = utils.calculateColors(this.dataIndex, this.dataConnectionCount, this.maximizeContrast);
			}
		}
	});
})();
