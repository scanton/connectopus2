(function() {
	var componentName = 'directory-selector';
	var s = `
		<div v-bind:class="{'has-selected-directory': label != 'select directory'}" v-on:click="handleClick" class="directory-selector">
			<span class="selection-status">
				<i class="fas fa-folder-open"></i>
			</span>
			<span class="selector-label">
				{{label}}
			</span>
			<input style="display: none;" v-on:change="handleChange" type="file" webkitdirectory v-bind:name="name" />
		</div>
	`;
	
	Vue.component(componentName, {
		created: function() {
			viewController.registerView(componentName, this);
		},
		mounted: function() {
			if(this.value) {
				this.label = this.value;
			}
		},
		props: ["name", "placeholder", "value"],
		template: s,
		data: function() {
			return {
				label: "select directory"
			}
		},
		methods: {
			getValue: function() {
				if(this.label == "select directory") {
					return "";
				}
				return this.label;
			},
			handleChange: function(e) {
				var input = $(e.target);
				var path = "select directory"
				if(input && input[0] && input[0].files && input[0].files[0] && input[0].files[0].path) {
					path = input[0].files[0].path;
				}
				this.label = path;
				this.$emit('change-value', path);
			},
			handleClick: function(e) {
				$(this.$el).find("input").click();
			}
		}
	});
})();