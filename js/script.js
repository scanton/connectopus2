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

const remote = require('electron').remote;
const {dialog} = require('electron').remote;

const EventEmitter = require(__dirname + '/custom_modules/utils/EventEmitter.js');
const AbstractModel = require(__dirname + '/custom_modules/abstracts/AbstractModel.js');
const ConfigModel = require(__dirname + '/custom_modules/models/ConfigModel.js');
const SettingsModel = require(__dirname + '/custom_modules/models/SettingsModel.js');
const ThemesModel = require(__dirname + '/custom_modules/models/ThemesModel.js');
const FileModel = require(__dirname + '/custom_modules/models/FileModel.js');

const configModel = new ConfigModel();
const settingsModel = new SettingsModel();
const themesModel = new ThemesModel();

const ViewController = require(__dirname + '/custom_modules/controllers/ViewController.js');
const viewController = new ViewController();

const fileModel = new FileModel();
const ConnectionsModel = require(__dirname + '/custom_modules/models/ConnectionsModel.js');
const connectionsModel = new ConnectionsModel(fileModel);

const ConnectopusController = require(__dirname + '/custom_modules/controllers/ConnectopusController.js');
const controller = new ConnectopusController(viewController, configModel, settingsModel, connectionsModel, themesModel, fileModel);

const stripObservers = function(obj) {
	return JSON.parse(JSON.stringify(obj, null, 4));
}

require('./custom_modules/utils/enableContextMenu.js')();

$(window).resize(function() {
	let wHeight = $(window).height();
	$(".category-side-bar").each(function() {
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
})

$(document).ready(function() {
	$(window).resize();
})

var mainView = new Vue({
	el: '#main-app'
});