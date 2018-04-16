module.exports = class ProjectsModel extends AbstractModel {

	constructor() {
		super();
		this._initializeProjects();
		this._dispatchUpdate();
	}
	createProject(name) {
		var projectId = new Date().getTime();
		this.projects[projectId] = {name: name, id:projectId };
		this.setCurrentProject(projectId);
		this._dispatchUpdate();
	}
	getCurrentProject() {
		return this.projects[this.currentProject];
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
			this._dispatchUpdate();
		} else {
			this.setCurrentProject(closestProjectId);
			this._dispatchUpdate();
		}
	}
	saveProject(data, callback, errorHandler) {
		console.log(data);
		callback(data);
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
	_initializeProjects() {
		var defaultProjectId = new Date().getTime();
		this.projects = {};
		this.projects[defaultProjectId] = { name: 'New Project', id: defaultProjectId };
		this.setCurrentProject(defaultProjectId);
	}
}