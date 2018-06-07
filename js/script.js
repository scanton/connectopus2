console.info = function() {};

const utils = {};
utils.sortArrayBy = function(arr, key, isDecending) {
	return arr.sort(function(a, b) {
		if(isDecending) {
			if(a[key].toLowerCase() > b[key].toLowerCase()) {
				return -1;
			} else if(a[key].toLowerCase() < b[key].toLowerCase()) {
				return 1
			}
			return 0;
		} else {
			if(a[key].toLowerCase() > b[key].toLowerCase()) {
				return 1;
			} else if(a[key].toLowerCase() < b[key].toLowerCase()) {
				return -1
			}
			return 0;
		}
	});
}
utils.calculateColors = function(index, connections, maximizeContrast) {
	var color;
	var halfCon = Math.ceil(connections/2);
	var adjustedIndex;
	if(maximizeContrast) {
		if(index % 2) {
			adjustedIndex = (halfCon + ((index + 1) / 2)) - 1;
		} else {
			adjustedIndex = index / 2;
		}
	} else {
		adjustedIndex = index;
	}
	var angle = (360 * (adjustedIndex / (connections + 1)));
	angle += 120;
	while(angle > 360) {
		angle -= 360;
	}
	if(angle >= 190 || (angle >= 0 && angle < 40)) {
		color = "white";
	} else {
		color = "black";
	}
	return {index: adjustedIndex, connections: connections, angle: angle, color: "black"};
	//return {index: adjustedIndex, connections: connections, angle: angle, color: color};
}

const remote = require('electron').remote;
const {dialog, shell} = require('electron').remote;
const {ipcRenderer} = require('electron');
const getUuid = require('uuid/v4');

const EventEmitter = require(__dirname + '/custom_modules/utils/EventEmitter.js');
const AbstractDataSource = require(__dirname + '/custom_modules/abstracts/AbstractDataSource.js');
const AbstractModel = require(__dirname + '/custom_modules/abstracts/AbstractModel.js');
const ConfigModel = require(__dirname + '/custom_modules/models/ConfigModel.js');
const SettingsModel = require(__dirname + '/custom_modules/models/SettingsModel.js');
const ThemesModel = require(__dirname + '/custom_modules/models/ThemesModel.js');
const DataModel = require(__dirname + '/custom_modules/models/DataModel.js');
const FileModel = require(__dirname + '/custom_modules/models/FileModel.js');
const NewsModel = require(__dirname + '/custom_modules/models/NewsModel.js');
const PathsModel = require(__dirname + '/custom_modules/models/PathsModel.js');
const ProjectsModel = require(__dirname + '/custom_modules/models/ProjectsModel.js');

const JSONDataSource = require(__dirname + '/custom_modules/data_sources/JSONDataSource.js');
const LocalDirectoryDataSource = require(__dirname + '/custom_modules/data_sources/LocalDirectoryDataSource.js');
const MySQLDataSource = require(__dirname + '/custom_modules/data_sources/MySQLDataSource.js');
const RESTDataSource = require(__dirname + '/custom_modules/data_sources/RESTDataSource.js');
const SFTPDataSource = require(__dirname + '/custom_modules/data_sources/SFTPDataSource.js');

const DataSourceFactory = require(__dirname + '/custom_modules/factories/DataSourceFactory.js');
DataSourceFactory.addConnectionType("JSON file", JSONDataSource);
DataSourceFactory.addConnectionType("Local Directory", LocalDirectoryDataSource);
DataSourceFactory.addConnectionType("MySQL", MySQLDataSource);
DataSourceFactory.addConnectionType("REST Endpoint", RESTDataSource);
DataSourceFactory.addConnectionType("Remote (SFTP)", SFTPDataSource);

const configModel = new ConfigModel();
const settingsModel = new SettingsModel();
const themesModel = new ThemesModel();
const newsModel = new NewsModel();
const pathsModel = new PathsModel();
const projectsModel = new ProjectsModel();

const ViewController = require(__dirname + '/custom_modules/controllers/ViewController.js');
const viewController = new ViewController();

const fileModel = new FileModel();
const dataModel = new DataModel();
const ConnectionsModel = require(__dirname + '/custom_modules/models/ConnectionsModel.js');
const connectionsModel = new ConnectionsModel(fileModel, dataModel);

const ConnectopusController = require(__dirname + '/custom_modules/controllers/ConnectopusController.js');
var controllers = {
	viewController: viewController
}
var models = {
	configModel: configModel, 
	settingsModel: settingsModel, 
	connectionsModel: connectionsModel, 
	themesModel: themesModel, 
	fileModel: fileModel, 
	dataModel: dataModel,
	newsModel: newsModel, 
	pathsModel: pathsModel, 
	projectsModel: projectsModel
};
const controller = new ConnectopusController(controllers, models);

ipcRenderer.on("controller-method", (event, arg) => {
	controller.handleExternalCall(arg);
});

const stripObservers = function(obj) {
	return JSON.parse(JSON.stringify(obj, null, 4));
}

require('./custom_modules/utils/enableContextMenu.js')();

$(window).resize(function() {
	let wHeight = $(window).height();
	$(".tool-bar").each(function() {
		let $sb = $(this);
		let sHeight = $sb.height();
		let sPos = $sb.offset();
		let targetHeight = wHeight - 25 - sPos.top;
		$sb.css("height", targetHeight + "px");
	});
	$(".main-view").each(function() {
		let $tc = $(this);
		let tHeight = $tc.height();
		let tPos = $tc.offset();
		let targetHeight = wHeight - 25 - tPos.top;
		$tc.attr("style", "height: " + targetHeight + "px");
		$tc.find(".value-container").css("height", (targetHeight - 33)  + "px");
	});
});

$(document).ready(function() {
	$(document).on("click", "a", function(e) {
		e.preventDefault();
		shell.openExternal($(this).attr("href"));
	});
	$(document).on("mouseenter", "a, button, li, span", function(e) {
		e.preventDefault();
		var label = $(this).attr("href") || $(this).attr("title");
		var $this = $(e.target);
		if($this.is("span") && label == "") {
			label = $this.closest("button").attr("title");
		}
		if(label) {
			controller.setLeftFooterLabel(label);
		}
	});
	$(document).on("mouseleave", "a, button, li, span", function(e) {
		e.preventDefault();
		controller.setLeftFooterLabel("");
	});
	$(window).resize();
});

const vm = new Vue({
	el: '#main-app'
});