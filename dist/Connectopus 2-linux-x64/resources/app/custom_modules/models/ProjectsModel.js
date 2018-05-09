module.exports = class ProjectsModel extends AbstractModel {

	constructor() {
		super();
		this._defaultProjectId = null;
		var d = __dirname.split("custom_modules/models")[0];
		this.projectsDirectory = d + 'working_files/projects/';
		this._initializeProjects();
		this.savedProjects = [];
		this.loadProjects();
	}
	createProject(name) {
		var projectId = new Date().getTime();
		this.projects[projectId] = { name: name, id:projectId };
		this.setCurrentProject(projectId);
		this._dispatchUpdate();
	}
	deleteProject(projectFile) {
		var path = this.projectsDirectory + projectFile;
		this.fs.removeSync(this.projectsDirectory + projectFile);
		this.loadProjects();
	}
	getCurrentProject() {
		return this.projects[this.currentProject];
	}
	getProject(id) {
		return this.projects[id];
	}
	loadProjects() {
		this.fs.pathExists(this.projectsDirectory, (err, exists) => {
			if(exists) {
				this.fs.readdir(this.projectsDirectory, (err, files) => {
					if(err) {
						controller.handleError(err);
					}
					var l = files.length;
					while(l--) {
						if(files[l].indexOf(".") == 0) {
							files.splice(l, 1);
						}
					}
					this.savedProjects = files.sort();
					this._dispatchUpdate();
				});
			} else {
				this.savedProjects = [];
				this._dispatchUpdate();
			}
		});
	}
	openProject(path, callback) {
		this.fs.readJson(path, (err, data) => {
			if(err) {
				controller.handleError(err);
			}
			if(data && data.project && data.project.id) {
				this._loadProject(data, callback);
			}
		});
	}
	projectExists(name, callback) {
		var path = this.projectsDirectory + name + '.json';
		this.fs.pathExists(path, callback);
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
	removeSavedProject(id) {
		this.fs.readdir(this.projectsDirectory, (err, files) => {
			if(files) {
				var l = files.length;
				while(l--) {
					if(files[l].indexOf(".") != 0) {
						var proj = this.fs.readJsonSync(this.projectsDirectory + '/' + files[l]);
						if(proj && proj.project && proj.project.id == id) {
							this.fs.removeSync(this.projectsDirectory + '/' + files[l]);
						}
					}
				}
			}
		});
	}
	saveProject(data, callback, errorHandler) {
		if(data && data.project && data.project.name) {
			this.removeSavedProject(data.project.id);
			var path = this.projectsDirectory + data.project.name + ".json";
			this.fs.outputJson(path, data, { spaces: '\t' }, (err) => {
				if(err && errorHandler) {
					errorHandler(err);
				} else {
					callback(data);
				}
				this.loadProjects();
			});
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
		this.dispatchEvent("data-update", {projects: this.projects, currentProject: this.currentProject, savedProjects: this.savedProjects});
	}
	_initializeProjects() {
		var defaultProjectId = new Date().getTime();
		this._defaultProjectId = defaultProjectId;
		this.projects = {};
		this.projects[defaultProjectId] = { name: 'New Project', id: defaultProjectId };
		this.setCurrentProject(defaultProjectId);
	}
	_loadProject(data, callback) {
		var id = data.project.id;
		if(!this.projects[id]) {
			this.projects[id] = data.project;
			this.setCurrentProject(id);
			this._dispatchUpdate();
			var totalConnections = data.connections.length;
			if(totalConnections) {
				var connectionsAdded = 0;
				var addConnection = function() {
					if(connectionsAdded < totalConnections) {
						var id = data.connections[connectionsAdded].id;
						controller.connectTo(id, addConnection);
						++connectionsAdded;
					} else {
						if(callback) {
							callback();
						}
					}
				}
				addConnection();
			} else {
				if(callback) {
					callback();
				}
			}
		}
	}
}