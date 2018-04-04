(function() {
	var componentName = 'file-compare';
	var s = `
		<span v-on:click="handleClick" v-bind:class="{'is-not-in-sync': primeFile.md5 != compareFile.md5}" class="file-compare">
			<span v-if="index == 0"><input type="checkbox" /></span>
			{{compareFile.name}}
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
			handleClick: function(e) {
				e.preventDefault();
				controller.compareFiles(this.conId, this.compareFile.path);
			}
		}
	});
})();
