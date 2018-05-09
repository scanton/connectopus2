(function() {
	var componentName = 'project-tabs';
	var s = `
		<div class="project-tabs">
			<ul>
				<tab v-for="(project, index) in projects" v-bind:index="index" v-bind:name="project.name" v-bind:isSelected="currentProject == project.id" v-bind:class="{selected: currentProject == project.id}" ></tab>
				<li class="tab add-tab" title="New Project" v-on:click="showAddProject">
					<span class="glyphicon glyphicon-plus"></span>
				</li>
			</ul>
		</div>
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
				this.projects = [];
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
