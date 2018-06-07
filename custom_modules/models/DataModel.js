module.exports = class DataModel extends AbstractModel {

	constructor() {
		super();
		this._dataContents = {};
	}

	setContents(con, path, data) {
		console.log("set", con.id, path);
		var id = con.id;
		if(!this._dataContents[id]) {
			this._dataContents[id] = {};
		}
		this._dataContents[id][path] = data;
		this.dispatchEvent("data-update", this._strip({con: con, id: id, path: path, data: this._strip(this._dataContents)}));
	}
	getContents(id, path) {
		if(this._dataContents && this._dataContents[id]) {
			console.log(id, path, this._strip(this._dataContents[id][path]));
		} else {
			console.log(id, path, "none", this._strip(this._dataContents));
		}
		if(this._dataContents[id] && this._dataContents[id][path]) {
			return this._strip(this._dataContents[id][path]);
		}
	}
	getAllContent() {
		return this._strip(this._dataContents);
	}
	hasContent(id, path) {
		if(this._dataContents[id] && this._dataContents[id][path]) {
			return true;
		}
		return false;
	}
}