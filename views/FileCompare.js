(function() {
	var componentName = 'file-compare';
	var s = `
		<span v-bind:title="getTitle()" v-bind:class="{'is-not-in-sync': primeFile.md5 != compareFile.md5}" class="file-compare">
			<span v-if="index == 0"><input type="checkbox" /></span>
			<span v-show="primeFile.md5 != compareFile.md5" v-on:click="handleClick">{{compareFile.name}}</span>
			<span v-show="primeFile.md5 == compareFile.md5">{{compareFile.name}}</span>
		</span>
	`;
	
	Vue.component(componentName, {
		created: function() {
			viewController.registerView(componentName, this);
		},
		props: ["primeFile", "compareFile", "index", "conId", "totalConnections"],
		template: s,
		data: function() {
			return {}
		},
		methods: {
			getTitle: function() {
				if(this.primeFile.md5 != this.compareFile.md5) {
					return "Compare/Diff";
				}
				return "";
			},
			handleClick: function(e) {
				e.preventDefault();
				controller.compareFiles(this.conId, this.compareFile.path);
			}
		}
	});
})();
