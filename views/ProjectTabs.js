(function() {
	var componentName = 'project-tabs';
	var s = `
		<ul class="project-tabs">
			<tab v-for="(project, index) in projects" v-bind:index="index" v-bind:name="project.name" v-bind:isSelected="currentProject == index" v-bind:class="{selected: currentProject == index}" ></tab>
			<!--
			<li v-for="(project, index) in projects" v-on:click="handleChangeProject(index)" v-bind:data-id="index" v-bind:class="{selected: currentProject == index}" class="tab">
				<span v-on:click="showDeleteProject(event, index)" class="glyphicon glyphicon-remove left-icon" title="Delete Project"></span>
				{{project.name}}
				<input class="tab-label-input" />
				<span class="glyphicon glyphicon-save" title="Save Project"></span>
			</li>
			-->
			<li class="tab add-tab" title="New Project" v-on:click="showAddProject">
				<span class="glyphicon glyphicon-plus"></span>
			</li>
		</ul>
	`;
	
	Vue.component(componentName, {
		created: function() {
			viewController.registerView(componentName, this);
		},
		template: s,
		data: function() {
			return {
				projects: [],
				currentProject: 0
			}
		},
		methods: {
			setProjects(projects) {
				this.projects = projects;
			},
			setCurrentProject(index) {
				this.currentProject = index;
			},
			addProject(name) {
				this.projects.push({name: name});
			},
			showAddProject() {
				controller.showAddProject();
			}
		}
	});
})();
