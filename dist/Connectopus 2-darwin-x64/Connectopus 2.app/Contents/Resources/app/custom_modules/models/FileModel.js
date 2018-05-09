module.exports = class FileModel extends AbstractModel {

	constructor() {
		super();
		this._fileContents = {};
	}

	setContents(con, path, data) {
		var id = con.id;
		if(!this._fileContents[id]) {
			this._fileContents[id] = {};
		}
		this._fileContents[id][path] = data;
		this.dispatchEvent("data-update", this._strip({con: con, id: id, path: path, files: data.files, directories: data.directories}));
	}
	getContents(id, path) {
		if(this._fileContents[id] && this._fileContents[id][path]) {
			return this._strip(this._fileContents[id][path]);
		}
	}
	getAllContent() {
		return this._strip(this._fileContents);
	}
	hasContent(id, path) {
		if(this._fileContents[id] && this._fileContents[id][path]) {
			return true;
		}
		return false;
	}
}