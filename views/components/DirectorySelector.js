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
			<input style="display: none;" v-on:change="handleChange" type="file" webkitdirectory />
			<input style="display: none;" type="text" v-bind:name="name" />
		</div>
	`;
	
	Vue.component(componentName, {
		created: function() {
			viewController.registerView(componentName, this);
		},
		mounted: function() {
			if(this.value) {
				this.label = this.value;
				$(this.$el).find("input[type='text']").val(this.value);
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
			handleChange: function(e) {
				var input = $(e.target);
				var path = "select directory"
				if(input && input[0] && input[0].files && input[0].files[0] && input[0].files[0].path) {
					path = input[0].files[0].path;
				}
				this.label = path;
				this.$emit('change-value', path);
				if(path == "select directory") {
					$(this.$el).find("input[type='text']").val("");
				} else {
					$(this.$el).find("input[type='text']").val(path);
				}
			},
			handleClick: function(e) {
				$(this.$el).find("input[type='file']").click();
			}
		},
		watch: {
			value: function(val) {
				this.label = val;
				$(this.$el).find("input[type='text']").val(val);
			}
		}
	});
})();