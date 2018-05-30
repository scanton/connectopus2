(function() {
	var componentName = 'check-box';
	var s = `
		<div v-on:click="toggleIsOn" class="check-box" v-bind:class="{'is-on': isOn, 'is-off': !isOn}" v-bind:data-val="isOn == true">
			<div class="background">
				<span v-show="isOn" class="label on-label">
					<i class="fas fa-check-square"></i>
				</span>
				<span v-show="!isOn" class="label off-label">
					<i class="fas fa-square"></i>
				</span>
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
