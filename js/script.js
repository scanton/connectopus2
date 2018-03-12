console.info = function() {};

const remote = require('electron').remote;
const {dialog} = require('electron').remote;

const EventEmitter = require(__dirname + '/custom_modules/EventEmitter.js');
const AbstractModel = require(__dirname + '/custom_modules/AbstractModel.js');
const ConfigModel = require(__dirname + '/custom_modules/ConfigModel.js');

const configModel = new ConfigModel();

const ViewController = require(__dirname + '/custom_modules/ViewController.js');
const viewController = new ViewController();

const ConnectopusController = require(__dirname + '/custom_modules/ConnectopusController.js');
const controller = new ConnectopusController(viewController, configModel);

const stripObservers = function(obj) {
	return JSON.parse(JSON.stringify(obj, null, 4));
}

require('./custom_modules/enableContextMenu.js')();

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