module.exports = class FileModel extends AbstractModel {

	constructor() {
		super();
		this._fileContents = {};
	}

	setContents(id, path, data) {
		if(!this._fileContents[id]) {
			this._fileContents[id] = {};
		}
		this._fileContents[id][path] = data;
		this.dispatchEvent("data-update", this._strip({id: id, path: path, data: data}));
	}
	getContents(id, path) {
		if(this._fileContents[id] && this._fileContents[id][path]) {
			return this._strip(this._fileContents[id][path]);
		}
	}
	getAllContent() {
		return this._strip(this._fileContents);
	}
}