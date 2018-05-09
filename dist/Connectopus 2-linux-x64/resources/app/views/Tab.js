(function() {
	var componentName = 'tab';
	var s = `
		<li class="tab" v-on:click="handleChangeProject(index)" ref="el">
			<span v-show="!isEditMode" v-on:click="showDeleteProject(event, index)" class="glyphicon glyphicon-remove left-icon" title="Delete Project"></span>
			<span v-show="!isEditMode" class="project-name">{{name}}</span>
			<input v-show="isEditMode" v-on:blur="handleBlur" v-on:click="supressEvent" v-on:keydown="handleKeyDown" class="tab-label-input" v-bind:value="name" />
			<span v-show="!isEditMode" class="glyphicon glyphicon-save" title="Save Project"></span>
		</li>
	`;
	
	Vue.component(componentName, {
		created: function() {
			viewController.registerView(componentName, this);
		},
		props: ["index", "name", "isSelected"],
		template: s,
		data: function() {
			return {
				isEditMode: false,
				lastWasKeyDown: false
			}
		},
		methods: {
			showDeleteProject(e, index) {
				e.preventDefault();
				e.stopImmediatePropagation();
				controller.showDeleteProject(index);
			},
			handleChangeProject(index) {
				if(this.isSelected) {
					if(!this.lastWasKeyDown) {
						if(this.isEditMode) {
							controller.setProjectName(this.index, $(this.$refs.el).find("input").val());
						} else {
							setTimeout(function() {
								$(this.$refs.el).find("input").select();
							}.bind(this), 100);
						}
						this.isEditMode = !this.isEditMode;
					} else {
						this.lastWasKeyDown = false;
					}
				} else {
					controller.setCurrentProject(index);
				}
			},
			handleKeyDown(e) {
				if(e.keyCode == 13) {
					this.handleChangeProject(this.index);
					this.lastWasKeyDown = true;
				}
			},
			handleBlur(e) {
				this.handleChangeProject(this.index);
			},
			supressEvent(e) {
				e.preventDefault();
				e.stopImmediatePropagation();
			}
		}
	});
})();
