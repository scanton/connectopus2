(function() {
	var componentName = 'file-compare';
	var s = `
		<span v-bind:title="getTitle()" v-bind:class="{'is-sync-action': primeFile.md5 != null && index == 0, 'is-delete-action': primeFile.md5 == null && index == 0, 'is-not-in-sync': primeFile.md5 != compareFile.md5}" class="file-compare">
			<span v-if="index == 0"><input v-on:click="handleCheckboxClick" type="checkbox" /></span>
			<span class="clickable" v-show="primeFile.md5 && (primeFile.md5 != compareFile.md5)" v-on:click="handleCompare">{{compareFile.name}}</span>
			<span class="non-clickable" v-show="!primeFile.md5 || (primeFile.md5 == compareFile.md5)">{{compareFile.name}}</span>
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
			handleCompare: function(e) {
				e.preventDefault();
				controller.compareFiles(this.conId, this.compareFile.path);
			},
			handleCheckboxClick: function(e) {
				controller.handleSelectedFilesChange();
			}
		}
	});
})();
