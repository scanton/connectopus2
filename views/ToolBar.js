(function() {
	var componentName = 'tool-bar';
	var s = `
		<div class="tool-bar side-bar">
			<ul class="categories">
				<li class="selected" title="Home" v-on:click="showHome">
					<span class="glyphicon glyphicon-home"></span>
				</li>
				<li title="Connections" v-on:click="showConnections">
					<span class="glyphicon glyphicon-globe"></span>
				</li>
				<li v-show="activeConnections.length" title="Compare" v-on:click="showFiles">
					<span class="glyphicon glyphicon-duplicate"></span>
				</li>
				<!--
				<li v-show="activeConnections.length" title="Data" v-on:click="showData">
					<span class="glyphicon glyphicon-hdd"></span>
				</li>
				-->
			</ul>
			<div style="text-align: center; cursor: default;" v-on:mouseover="handleShowAllLables" v-on:mouseout="handleHideAllLabels" v-show="activeConnections.length">Status</div>
			<ul class="active-connections" v-bind:class="{ 'mouse-is-over': showAllLabels }">
				<active-connection v-for="(con, index) in activeConnections" v-bind:con="con" v-bind:index="index" v-bind:connections="activeConnections.length"></active-connection>
			</ul>
		</div>
	`;
	var _handle = function(e) {
		if(e) {
			e.preventDefault();
			var $t = $(e.target);
			$t.closest("ul").find(".selected").removeClass("selected");
			if($t.hasClass("glyphicon")) {
				$t = $t.closest("li");
			}
			$t.addClass("selected");
		}
	}

	Vue.component(componentName, {
		created: function() {
			viewController.registerView(componentName, this);
		},
		template: s,
		data: function() {
			return {
				activeConnections: [],
				showAllLabels: false
			}
		},
		methods: {
			showHome: function(e) {
				_handle(e);
				controller.showHomePage();
			},
			showConnections: function(e) {
				_handle(e);
				controller.showConnectionsPage();
			},
			showData: function(e) {
				_handle(e);
				controller.showDataPage();
			},
			showFiles: function(e) {
				_handle(e);
				controller.showFilesPage();
			},
			handleShowAllLables: function(e) {
				e.preventDefault();
				this.showAllLabels = true;
				controller.handleShowAllLabels();
			},
			handleHideAllLabels: function(e) {
				e.preventDefault();
				this.showAllLabels = false;
				controller.handleHideAllLabels();
			},
			setConnectionStatus: function(data) {
				this.activeConnections = data;
			}
		}
	});
})();
