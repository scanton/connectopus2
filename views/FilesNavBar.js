(function() {
	var componentName = 'files-nav-bar';
	var s = `
		<div class="files-nav-bar container-fluid">
			<div class="row">
				<div class="col-xs-12">
					<button class="btn btn-warning pull-right" title="Sync Selected Files">
						<span class="glyphicon glyphicon-export"></span>
					</button>
					<button class="btn btn-default pull-right" title="Crawl Directories">
						<span class="glyphicon glyphicon-eye-open"></span>
					</button>
					<button class="btn btn-default pull-right" title="Refresh Path">
						<span class="glyphicon glyphicon-refresh"></span>
					</button>
					<button class="btn btn-default">
						<span class="glyphicon glyphicon-chevron-left"></span>
					</button>
					<span class="path-link">
						<span v-show="pathData.length == 0">{ root }</span>
						<button v-show="pathData.length > 0" class="btn btn-default path-button" data-path="" >{ root }</button>
						<span v-show="pathData.length" class="delimiter">/</span>
					</span>
					<span v-for="(p, index) in pathData" class="path-link">
						<button v-show="index != pathData.length - 1" class="btn btn-default path-button" v-bind:data-path="p.path" >{{p.name}}</button>
						<span v-show="index != pathData.length - 1" class="delimiter">/</span>
						<span v-show="index == pathData.length - 1">{{p.name}}</span>
					</span>
					
					<button class="btn btn-default">
						<span class="glyphicon glyphicon-chevron-right"></span>
					</button>
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
				pathData: []
			}
		},
		methods: {
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
