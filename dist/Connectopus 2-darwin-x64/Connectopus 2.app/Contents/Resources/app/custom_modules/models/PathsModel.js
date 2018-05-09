module.exports = class PathsModel extends AbstractModel {

	constructor() {
		super();
		this._paths = {};
		this._indexes = {}
		this._currentProject = null;
	}

	getPathData() {
		this._strip({currentPath: this._currentPath, paths: this._paths, root: this._root});
	}
	setCurrentProject(id) {
		this._currentProject = id;
		if(!this._paths[id]) {
			this._paths[id] = [];
		}
		if(!this._indexes[id]) {
			this._indexes[id] = 0;
		}
	}
	setPath(path) {
		this._paths[this._currentProject].push(path);
		++this._indexes[this._currentProject];
		dispatchEvent("path-change", this.getPathData());
	}
	previousPath() {
		if(this._indexes[_indexes[this._currentProject]] > 0) {
			--this._indexes[this._currentProject];
			dispatchEvent("path-change", this.getPathData());
		}
	}
	nextPath() {
		if(this._paths[this._currentProject].length - 1 > this._indexes[this._currentProject]) {
			++this._indexes[this._currentProject];
			dispatchEvent("path-change", this.getPathData());
		}
	}
	isAtBeginning() {
		return this._currentPath == 0;
	}
	isAtEnd() {
		return this._currentPath == this._paths.length - 1;
	}
}