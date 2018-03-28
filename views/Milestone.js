(function() {
	var componentName = 'milestone';
	var s = `
		<div class="milestone" v-on:click="handleToggleDescription">
			<h3>
				<span v-bind:class="getIcon()" v-bind:style="getIconStyle()"></span> 
				<span v-bind:style="getBadgeStyle()" class="badge">{{status}}</span> {{title}}<sub>...</sub>
			</h3>
			<div class="description" style="display: none;" ref="desc">
				{{description}}
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
					return "glyphicon glyphicon-question-sign";
				}
			},
			getIconStyle: function() {
				var status = this.status
				if(this.status == "complete") {
					return "color: green;";
				} else if(status == "to-do") {
					return "color: orange;";
				} else if(status == "in-progress") {
					return "color: #3F3;";
				} else {
					return "color: orange;";
				}
			},
			getBadgeStyle: function() {
				var status = this.status
				if(this.status == "complete") {
					return "background-color: green;";
				} else if(status == "to-do") {
					return "background-color: orange;";
				} else if(status == "in-progress") {
					return "background-color: #3F3; color: black";
				} else {
					return "background-color: orange;";
				}
			},
			handleToggleDescription: function(e) {
				e.preventDefault();
				$(this.$refs.desc).slideToggle();
			}
		}
	});
})();
