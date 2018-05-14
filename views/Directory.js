(function() {
	var componentName = 'directory';
	var s = `
		<li title="Browse Folder" v-on:click="handleClick" class="directory container-fluid" v-bind:data-path="directory.path">
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
				if($(e.target).is("li")) {
					var $target = $(e.target);
				} else {
					var $target = $(e.target).closest("li");
				}
				var path = $target.attr("data-path");
				controller.setFilePath(path);
			}
		}
	});
})();
