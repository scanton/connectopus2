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

	static addConnectionType(type, classConstructor) {
		if(!DataSourceFactory._connectonTypes[type]) {
			DataSourceFactory._connectonTypes[type] = classConstructor;
		}
	}
}
DataSourceFactory._connectonTypes = {};
module.exports = DataSourceFactory;