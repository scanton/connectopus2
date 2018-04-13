module.exports = class ProjectsModel extends AbstractModel {

	constructor() {
		super();
		var defaultProjectId = new Date().getTime();
		this.projects = {};
		this.projects[defaultProjectId] = { name: 'Project 1', id: defaultProjectId };
		this.setCurrentProject(defaultProjectId);
		this._dispatchUpdate();
	}
	createProject(name) {
		var projectId = new Date().getTime();
		this.projects[projectId] = {name: name, id:projectId };
		this.setCurrentProject(projectId);
		this._dispatchUpdate();
	}
	getProject(id) {
		return this.projects[id];
	}
	removeProject(index) {
		delete this.projects[index];
		var leastDiff = Number.POSITIVE_INFINITY;
		var closestProjectId, delta;
		for(var i in this.projects) {
			delta = Math.abs(Number(index) - Number(i));
			if(delta < leastDiff) {
				leastDiff = delta;
				closestProjectId = i;
			}
		}
		if(closestProjectId == undefined) {
			this._initializeProjects();
		} else {
			this.setCurrentProject(closestProjectId);
			this._dispatchUpdate();
		}
	}
	setCurrentProject(id) {
		this.currentProject = id;
	}
	setProjectName(index, name) {
		if(this.projects[index] && this.projects[index].name) {
			this.projects[index].name = name;
			this._dispatchUpdate();
		}
	}
	totalProjects() {
		var l = 0;
		for(var i in this.projects) {
			++l;
		}
		return l;
	}
	_dispatchUpdate() {
		this.dispatchEvent("data-update", {projects: this.projects, currentProject: this.currentProject});
	}
}