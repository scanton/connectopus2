module.exports = class ConnectionsModel extends AbstractModel {

	constructor() {
		super();
		this._connections = [];
	}

	addConnection(con, callback) {
		if(con && con.id && !this.hasConnection(con.id)) {
			var conId = con.id;
			con = this._strip(con);
			con.status = 'pending';
			this._connections.push(con);
			this._dispatchUpdate();
			if(con.connectionType == "Local Directory") {
				this.fs.pathExists(con.directory, function(err, exists) {
					if(err) {
						this.setStatus(conId, 'error');
						controller.handleError(err);
					} else {
						
						if(!exists) {
							status = 'error';
							controller.handleError({ description: "Directory does not exist", connection: con, scope: this });
						} else {
							this.fs.readdir(con.directory, function(err, files) {
								if(err) {
									this.setStatus(conId, 'error');
									controller.handleError(err);
								}
								var status = 'connected';
								this.setStatus(conId, status);
								if(callback) {
									callback(this._strip(this._connections));
								}
							}.bind(this));
						}
					}
				}.bind(this));
			} else if(con.connectionType == "Remote (SFTP)") {
				this.setStatus(conId, 'connected');
				if(callback) {
					callback(this._strip(this._connections));
				}
			} else {
				this.setStatus(conId, 'error');
				controller.handleError({ description: "unsupported connection type: " + con.connectionType, connection: con, scope: this });
			}
		}
	}

	setStatus(id, status) {
		var l = this._connections.length;
		while(l--) {
			if(this._connections[l].id == id) {
				this._connections[l].status = status;
				this._dispatchUpdate();
				return true;
			}
		}
		return false;
	}

	removeConnection(id, callback) {
		var l = this._connections.length;
		while(l--) {
			if(this._connections[l].id == id) {
				this._connections.splice(l, 1);
				return 1;
			}
		}
		return 0;
	}

	hasConnection(id) {
		var l = this._connections.length;
		while(l--) {
			if(this._connections[l].id == id) {
				return true;
			}
		}
		return false;
	}

	_dispatchUpdate() {
		this.dispatchEvent("connections-status", this._strip(this._connections));
	}
}