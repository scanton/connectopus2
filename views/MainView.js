(function() {
	var componentName = 'main-view';
	var s = `
		<div class="main-view">
			<div>
				<welcome-page v-show="category == 'home'"><welcome-page>
			</div>
			<div>
				<connections-page v-show="category == 'connections'"><connections-page>
			</div>
			<div>
				<data-page v-show="category == 'data'"><data-page>
			</div>
			<div>
				<files-page v-show="category == 'files'"><files-page>
			</div>
		</div>
	`;
	
	Vue.component(componentName, {
		created: function() {
			viewController.registerView(componentName, this);
		},
		template: s,
		data: function() {
			return {
				category: 'home'
			}
		},
		methods: {
			showHome: function() {
				this.category = 'home';
			},
			showConnections: function() {
				this.category = 'connections';
			},
			showData: function() {
				this.category = 'data';
			},
			showFiles: function() {
				this.category = 'files';
			}
		}
	});
})();
