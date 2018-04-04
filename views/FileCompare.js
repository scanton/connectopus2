(function() {
	var componentName = 'file-compare';
	var s = `
		<span v-bind:class="{'is-not-in-sync': primeFile.md5 != compareFile.md5}" class="file-compare">
			<span v-if="index == 0"><input type="checkbox" /></span>
			{{compareFile.name}}
		</span>
	`;
	
	Vue.component(componentName, {
		created: function() {
			viewController.registerView(componentName, this);
		},
		props: ["primeFile", "compareFile", "index", "totalConnections"],
		template: s,
		data: function() {
			return {}
		},
		methods: {
			
		}
	});
})();
