(function() {
	var componentName = 'files-nav-bar';
	var s = `
		<div class="files-nav-bar container-fluid">
			<div class="row">
				<div class="col-xs-12">
					<button v-on:click="handleSyncFiles" v-show="filesAreSelected" class="btn btn-warning pull-right" title="Sync Selected Files">
						<span class="glyphicon glyphicon-export"></span> Sync Selected Files
					</button>
					<button v-on:click="handleRefreshView" class="btn btn-default pull-right" title="Refresh View">
						<span class="glyphicon glyphicon-refresh"></span>
					</button>
					<button v-on:click="handleGitPull" class="btn btn-default pull-right" title="Pull Git Repositories">
						<span class="glyphicon glyphicon-cloud-download"></span>
					</button>
					<!--
					<button class="btn btn-default pull-right" title="Crawl Directories">
						<span class="glyphicon glyphicon-eye-open"></span>
					</button>
					-->

					<!--
					<button class="btn btn-default">
						<span class="glyphicon glyphicon-chevron-left"></span>
					</button>
					-->
					<span class="path-link">
						<button v-on:click="handleChangePath" class="btn btn-default path-button" data-path="" >{ root }</button>
						<span class="delimiter">/</span>
					</span>
					<span v-for="(p, index) in pathData" class="path-link">
						<button v-on:click="handleChangePath" v-show="index != pathData.length - 1" class="btn btn-default path-button" v-bind:data-path="p.path" >{{p.name}}</button>
						<span v-show="index != pathData.length - 1" class="delimiter">/</span>
						<span v-show="index == pathData.length - 1">{{p.name}}</span>
					</span>
					<!--
					<button class="btn btn-default">
						<span class="glyphicon glyphicon-chevron-right"></span>
					</button>
					-->
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
				path: '',
				pathData: [],
				filesAreSelected: false
			}
		},
		methods: {
			handleChangePath: function(e) {
				e.preventDefault();
				var $this = $(e.target);
				var path = $this.attr("data-path");
				controller.setFilePath(path);
			},
			handleGitPull: function(e) {
				e.preventDefault();
				controller.pullGitConnections();
			},
			handleSyncFiles: function(e) {
				e.preventDefault();
				controller.syncSelectedFiles();
			},
			handleRefreshView: function(e) {
				controller.setFilePath(this.path, true);
			},
			handleSelectedFilesChange: function(data) {
				this.filesAreSelected = data.syncCount + data.deleteCount;
			},
			setPath: function(path) {
				this.path = path;
				var a = this.path.split("/");
				if(a.length) {
					var s = '';
					var l = a.length;
					for(var i = 0; i < l; i++) {
						if(s.length) {
							s += '/'
						}
						s += a[i];
						a[i] = { name: a[i], path: s };
					}
				}
				this.pathData = a;
			}
		}
	});
})();
