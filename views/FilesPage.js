(function() {
	var componentName = 'files-page';
	var s = `
		<div class="files-page container-fluid">
			<div class="row">
				<div class="col-xs-12 file-listings">
					<files-nav-bar></files-nav-bar>
					<table class="file-listing-table">
						<tr>
							<th class="connection-name" v-for="(conId, index) in connections" v-bind:style="getStyle(index, totalConnections, maximizeContrast)">
								<span class="pull-left" v-if="index == 0"><input v-on:click="handleSelectAll" type="checkbox" /></span>
								{{getName(conId)}}
							</th>
						</tr>
						<tr v-for="file in files.allFiles">
							<td v-bind:class="{'row-is-in-sync': isRowInSync(file)}" class="file-compare-listing" v-for="(conId, index) in connections" v-bind:style="getStyle(index, totalConnections, maximizeContrast)">
								<file-compare v-bind:conId="conId" v-bind:index="index" v-bind:totalConnections="totalConnections" v-bind:primeFile="getPrimeFile(file.name)" v-bind:compareFile="getFile(file.name, conId)"></file-compare>
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
				primeId: null,
				maximizeContrast: null
			}
		},
		methods: {
			getFile: function(name, conId) {
				var fileArray = this.files[conId];
				if(fileArray) {
					var l = fileArray.length;
					while(l--) {
						if(fileArray[l].name == name) {
							return fileArray[l];
						}
					}
				}
				return {};
			},
			getName: function(id) {
				return controller.getConnectionName(id);
			},
			getPrimeFile: function(name) {
				var primes = this.getPrimeFiles();
				var l = primes.length;
				while(l--) {
					if(primes[l].name == name) {
						return primes[l];
					}
				}
				return {};
			},
			getPrimeFiles: function() {
				var primeId = this.primeId = controller.getPrimeId();
				if(primeId && this.files[primeId]) {
					return this.files[primeId];
				}
				return [];
			},
			getStyle: function(index, totalConnections, maximizeContrast) {
				var colorStyle = controller.getColorStyle();
				var colorData = utils.calculateColors(index, totalConnections, maximizeContrast);
				return {background: "hsl(" + colorData.angle + ", " + colorStyle.saturation + ", " + colorStyle.luminance + ")", color: colorData.color};
			},
			handleFileModelUpdate: function() {
				this.files = controller.getFiles(this.connections, this.path);
			},
			handleSelectAll: function(e) {
				var isChecked = $(e.target).is(":checked");
				$(".file-listing-table input").prop("checked", isChecked);
				controller.handleSelectedFilesChange();
			},
			isRowInSync: function(file) {
				if(this.connections.length > 1) {
					var compFile;
					var primeFile = this.getPrimeFile(file.name);
					var l = this.connections.length;
					if(primeFile) {
						while(l--) {
							compFile = this.getFile(file.name, this.connections[l]);
							if(compFile.md5 != primeFile.md5) {
								return false;
							}
						}
						return true;
					}
				}
				return false;
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
			setMaximizeContrast: function(bool) {
				this.maximizeContrast = bool;
			},
			setPath: function(path) {
				this.path = path;
				this.handleFileModelUpdate();
			}
		}
	});
})();
