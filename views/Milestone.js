(function() {
	var componentName = 'milestone';
	var s = `
		<div v-bind:class="status" class="milestone" v-on:click="handleToggleDescription">
			<span class="badge">{{status}}</span>
			<span v-bind:class="getIcon()"></span>
			<h3>
				{{title}}<sub>...</sub>
			</h3>
			<div class="description" style="display: none;" ref="desc">
				<span v-html="description"></span>
			</div>
		</div>
	`;
	
	Vue.component(componentName, {
		created: function() {
			viewController.registerView(componentName, this);
		},
		props: ["title", "status", "description"],
		template: s,
		data: function() {
			return {}
		},
		methods: {
			getIcon: function() {
				var status = this.status
				if(this.status == "complete") {
					return "glyphicon glyphicon-ok-sign";
				} else if(status == "to-do") {
					return "glyphicon glyphicon-question-sign";
				} else if(status == "in-progress") {
					return "glyphicon glyphicon-plus-sign";
				} else {
					return "glyphicon glyphicon-remove-sign";
				}
			},
			handleToggleDescription: function(e) {
				e.preventDefault();
				$(this.$refs.desc).slideToggle();
			}
		}
	});
})();
