(function() {
	var componentName = 'database-table';
	var s = `
		<li title="Browse Table" v-on:click="handleClick" class="database-table container-fluid" v-bind:data-path="table.path">
			<span class="glyphicon glyphicon-folder-close"></span>{{table.name}}
		</li>
	`;
	
	Vue.component(componentName, {
		created: function() {
			viewController.registerView(componentName, this);
		},
		props: ['table'],
		template: s,
		data: function() {
			return {}
		},
		methods: {
			handleClick: function(e) {
				console.log("click table");
				/*
				if($(e.target).is("li")) {
					var $target = $(e.target);
				} else {
					var $target = $(e.target).closest("li");
				}
				var path = $target.attr("data-path");
				controller.setFilePath(path);
				*/
			}
		}
	});
})();
