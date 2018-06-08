(function() {
	var componentName = 'database-table';
	var s = `
		<li title="Browse Table" v-on:click="handleClick(table[0].table)" class="database-table container-fluid" v-bind:data-path="table.path">
			<i class="fas fa-table glyphicon"></i> {{table[0].table}}
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
			handleClick: function(tableName) {
				this.$emit('table-click', tableName);
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
