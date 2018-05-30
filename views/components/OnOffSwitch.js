(function() {
	var componentName = 'on-off-switch';
	var s = `
		<div v-on:click="toggleIsOn" class="on-off-switch" v-bind:class="{'is-on': isOn, 'is-off': !isOn}" v-bind:data-val="isOn == true">
			<div class="background">
				<span class="on-off-label on-label">ON</span>
				<span class="on-off-handle"></span>
				<span class="on-off-label off-label">OFF</span>
			</div>
		</div>
	`;
	Vue.component(componentName, {
		created: function() {
			viewController.registerView(componentName, this);
		},
		props: ["isOn"],
		template: s,
		data: function() {
			return {}
		},
		methods: {
			toggleIsOn: function() {
				this.isOn = !this.isOn;
			}
		}
	});
})();