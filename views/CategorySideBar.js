(function() {
	var componentName = 'category-side-bar';
	var s = `
		<div class="category-side-bar side-bar">
			<ul>
				<li class="selected" title="Home" v-on:click="showHome">
					<span class="glyphicon glyphicon-home"></span>
				</li>
				<li title="Connections" v-on:click="showConnections">
					<span class="glyphicon glyphicon-globe"></span>
				</li>
				<li title="Data" v-on:click="showData">
					<span class="glyphicon glyphicon-hdd"></span>
				</li>
				<li title="Files" v-on:click="showFiles">
					<span class="glyphicon glyphicon-duplicate"></span>
				</li>
			</ul>
			<ul class="active-connections">
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
				activeConnections: []
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
			setConnectionStatus: function(data) {
				this.activeConnections = data;
			}
		}
	});
})();
