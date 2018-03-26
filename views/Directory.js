(function() {
	var componentName = 'directory';
	var s = `
		<li v-on:click="handleClick" class="directory container-fluid" v-bind:data-path="directory.path">
			<span class="glyphicon glyphicon-folder-close"></span>{{directory.name}}
		</li>
	`;
	
	Vue.component(componentName, {
		created: function() {
			viewController.registerView(componentName, this);
		},
		props: ['directory'],
		template: s,
		data: function() {
			return {}
		},
		methods: {
			handleClick: function(e) {
				controller.setFilePath($(e.target).attr("data-path"));
			}
		}
	});
})();
