(function() {
	var componentName = 'horizontal-rule';
	var s = `
		<div class="horizontal-rule">
			<div class="doo-dads text-center top-bar bar">
				<div class="dot"></div>
				<div class="dot"></div>
				<div class="dash-10"></div>
				<div class="dot"></div>
				<div class="dash-10"></div>
				<div class="dot"></div>
				<div class="dot"></div>
				<div class="dot"></div>
				<div class="dot"></div>
				<div class="dot"></div>
				<div class="dash-10"></div>
				<div class="dot"></div>
				<div class="dash-10"></div>
				<div class="dot"></div>
				<div class="dot"></div>
			</div>
			<div v-if="isLarge" class="horizontal-bar middle-bar bar"></div>
			<div v-if="isLarge" class="doo-dads text-center bottom-bar bar">
				<div class="dot"></div>
				<div class="dot"></div>
				<div class="dash-10"></div>
				<div class="dot"></div>
				<div class="dash-10"></div>
				<div class="dot"></div>
				<div class="dot"></div>
				<div class="dot"></div>
				<div class="dot"></div>
				<div class="dot"></div>
				<div class="dash-10"></div>
				<div class="dot"></div>
				<div class="dash-10"></div>
				<div class="dot"></div>
				<div class="dot"></div>
			</div>

		</div>
	`;
	
	Vue.component(componentName, {
		created: function() {
			viewController.registerView(componentName, this);
		},
		props: ["isLarge"],
		template: s,
		data: function() {
			return {
			}
		},
		methods: {
		}
	});
})();
