(function() {
	
	const remote = require('electron').remote;

	var componentName = 'title-bar';
	var s = `
		<div v-bind:class="[theme, status]" class="titlebar webkit-draggable">
			<div class="titlebar-stoplight">
				<div class="titlebar-close" v-on:click="close">
					<svg x="0px" y="0px" viewBox="0 0 6.4 6.4">
						<polygon fill="#4d0000" points="6.4,0.8 5.6,0 3.2,2.4 0.8,0 0,0.8 2.4,3.2 0,5.6 0.8,6.4 3.2,4 5.6,6.4 6.4,5.6 4,3.2"></polygon>
					</svg>
				</div>
				<div class="titlebar-minimize" v-on:click="minimize">
					<svg x="0px" y="0px" viewBox="0 0 8 1.1">
						<rect fill="#995700" width="8" height="1.1"></rect>
					</svg>
				</div>
				<div class="titlebar-fullscreen" v-on:click="toggleFullScreen">
					<svg class="fullscreen-svg" x="0px" y="0px" viewBox="0 0 6 5.9">
						<path fill="#006400" d="M5.4,0h-4L6,4.5V0.6C5.7,0.6,5.3,0.3,5.4,0z"></path>
						<path fill="#006400" d="M0.6,5.9h4L0,1.4l0,3.9C0.3,5.3,0.6,5.6,0.6,5.9z"></path>
					</svg>
					<svg class="maximize-svg" x="0px" y="0px" viewBox="0 0 7.9 7.9">
						<polygon fill="#006400" points="7.9,4.5 7.9,3.4 4.5,3.4 4.5,0 3.4,0 3.4,3.4 0,3.4 0,4.5 3.4,4.5 3.4,7.9 4.5,7.9 4.5,4.5"></polygon>
					</svg>
				</div>
			</div> {{title}} - <span v-show="!isDefaultSubject" class="glyphicon glyphicon-star"></span> {{subject}} <span v-show="!isDefaultSubject" class="glyphicon glyphicon-star"></span>
		</div>
	`;
	
	Vue.component(componentName, {
		created: function() {
			viewController.registerView(componentName, this);
			controller.addListener("general-status", this.handleGeneralStatus.bind(this));
		},
		template: s,
		data: function() {
			return {
				title: 'Connectopus 2',
				subject: 'Kenetic Boogaloo',
				theme: '',
				status: '',
				isDefaultSubject: true
			}
		},
		methods: {
			setTheme: function(theme) {
				this.theme = theme;
			},
			close: function() {
				window.close();
			},
			minimize: function() {
				remote.getCurrentWindow().minimize();
			},
			toggleFullScreen: function() {
				var win = remote.getCurrentWindow();
				win.setFullScreen(win.isFullScreen());
			},
			handleGeneralStatus: function(status) {
				this.status= status;
			},
			setSubject: function(subject) {
				this.isDefaultSubject = false;
				this.subject = subject;
			}
		}
	});
})();
