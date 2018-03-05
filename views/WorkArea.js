(function() {
	var componentName = 'work-area';
	var s = `
		<div v-bind:class="[category, {'context-is-visible': isContextVisible }]" class="work-area">
			<main-view></main-view>
			<context-side-bar></context-side-bar>
			<settings-side-bar></settings-side-bar>
			<category-side-bar></category-side-bar>
			<footer-bar></footer-bar>
			<top-nav></top-nav>
		</div>
	`;
	var setCategory = function(str, instance) {
		instance.category = str;
		instance.isContextVisible = str != 'home';
	}

	Vue.component(componentName, {
		created: function() {
			viewController.registerView(componentName, this);
		},
		template: s,
		data: function() {
			return {
				category: 'home',
				isContextVisible: false
			}
		},
		methods: {
			showHome: function() {
				setCategory("home", this);
			},
			showConnections: function() {
				setCategory("connections", this);
			},
			showData: function() {
				setCategory("data", this);
			},
			showFiles: function() {
				setCategory("files", this);
			}
		}
	});
})();
