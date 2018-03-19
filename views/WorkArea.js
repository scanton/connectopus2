(function() {
	var componentName = 'work-area';
	var s = `
		<div v-bind:class="[category, theme, {'context-is-visible': isContextVisible, 'settings-is-visible': isSettingsVisible}]" class="work-area">
			<main-view></main-view>
			<context-side-bar></context-side-bar>
			<settings-side-bar></settings-side-bar>
			<category-side-bar></category-side-bar>
			<footer-bar></footer-bar>
			<top-nav></top-nav>
		</div>
	`;
	var setCategory = function(str, instance) {
		if(str == instance.category && str != 'home') {
			instance.isContextVisible = !instance.isContextVisible;
		} else {
			instance.isContextVisible = str != 'home';
		}
		instance.category = str;
	}

	Vue.component(componentName, {
		created: function() {
			viewController.registerView(componentName, this);
		},
		template: s,
		data: function() {
			return {
				category: 'home',
				isContextVisible: false,
				isSettingsVisible: false,
				theme: ''
			}
		},
		methods: {
			setTheme: function(theme) {
				this.theme = theme;
			},
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
			},
			toggleSettings: function() {
				this.isSettingsVisible = !this.isSettingsVisible;
			}
		}
	});
})();
