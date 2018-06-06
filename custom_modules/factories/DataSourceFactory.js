class DataSourceFactory {

	constructor() {}

	static createConnection(con) {
		if(DataSourceFactory._connectonTypes[con.connectionType]) {
			var liveConnection = new DataSourceFactory._connectonTypes[con.connectionType](con.connectionType, con);
			return liveConnection;
		} else {
			controller.handleError("Undefined Connection Type " + con.connectionType, con);
		}
	}

	static createDatabaseConnection(con, index = 0) {
		if(con && con.connections && con.connections[index] && DataSourceFactory._connectonTypes[con.connections[index].type]) {
			var liveConnection = new DataSourceFactory._connectonTypes[con.connections[index].type](con.connections[index].type, con);
			return liveConnection;
		} else {
			controller.handleError("Undefined Database Connection Type ", con);
		}
	}

	static addConnectionType(type, classConstructor) {
		if(!DataSourceFactory._connectonTypes[type]) {
			DataSourceFactory._connectonTypes[type] = classConstructor;
		}
	}
}
DataSourceFactory._connectonTypes = {};
module.exports = DataSourceFactory;