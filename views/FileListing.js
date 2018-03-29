(function() {
	var componentName = 'file-listing';
	var s = `
		<div class="file-listing container-fluid" v-bind:style="getStyle()">
			<div class="row">
				<div class="col-xs-12">
					<div class="header connection-name">
						<span class="selection-column" v-if="dataIndex == 0">
							<input type="checkbox" class="select-all select-file-checkbox pull-left" />
						</span> 
						{{connectionName}}
					</div>
					<div class="file" v-for="file in allFiles" v-bind:data-path="file.path">
						<span class="selection-column" v-if="dataIndex == 0">
							<input type="checkbox" class="select-file-checkbox" />
						</span> 
						<span v-if="file && hasFile(file.path)" v-bind:md5="getFileHash(file.path)" v-bind:class="{'is-not-in-sync': !isInSync(file.path)}">
							{{getFileName(file.path)}}
						</span>&nbsp;
					</div>
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
		props: ["files", "allFiles", "primeFiles", "dataConnectionCount", "dataIndex", "dataConnectionId", "connectionName"],
		template: s,
		data: function() {
			return {
				colorData: null,
				maximizeContrast: null,
				colorStyle: controller.getColorStyle()
			}
		},
		methods: {
			getFileName: function(path) {
				if(path && this.files) {
					var l = this.files.length;
					while(l--) {
						if(this.files[l] && this.files[l].path == path) {
							return this.files[l].name;
						}
					}
				}
			},
			getFileHash: function(path) {
				if(path && this.files) {
					var l = this.files.length;
					while(l--) {
						if(this.files[l].path == path) {
							return this.files[l].md5;
						}
					}
				}
			},
			getStyle: function() {
				return {background: "hsl(" + this.colorData.angle + ", " + this.colorStyle.saturation + ", " + this.colorStyle.luminance + ")", color: this.colorData.color};
			},
			hasFile: function(path) {
				if(path && this.files) {
					var l = this.files.length;
					while(l--) {
						if(this.files[l] && this.files[l].path == path) {
							return true;
						}
					}
				}
				return false;
			},
			isInSync: function(path) {
				if(path && this.files && this.primeFiles) {
					var l = this.files.length;
					while(l--) {
						if(this.files[l] && this.files[l].path == path) {
							var thisVersion = this.files[l];
							var l2 = this.primeFiles.length;
							while(l2--) {
								if(this.primeFiles[l2] && this.primeFiles[l2].path == path) {
									return this.primeFiles[l2].md5 == thisVersion.md5;
								}
							}
							return false;
						}
					}
				}
				return false;
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
