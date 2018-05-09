(function() {
	var componentName = 'connectopus-animation';
	var s = `
		<div class="connectopus-animation">
			<div class="legs rotating">
				<div class="leg leg-1">
					<div class="tip top"></div>
					<div class="rod"></div>
					<div class="tip bottom"></div>
				</div>
				<div class="leg leg-2">
					<div class="tip top"></div>
					<div class="rod"></div>
					<div class="tip bottom"></div>
				</div>
				<div class="leg leg-3">
					<div class="tip top"></div>
					<div class="rod"></div>
					<div class="tip bottom"></div>
				</div>
				<div class="leg leg-4">
					<div class="tip top"></div>
					<div class="rod"></div>
					<div class="tip bottom"></div>
				</div>
			</div>
			<div class="head">
				<div class="cranium">
					<div class="eye left"></div>
					<div class="eye right"></div>
					<div class="smile"></div>
				</div>
			</div>
		</div>
	`;
	
	Vue.component(componentName, {
		created: function() {
			viewController.registerView(componentName, this);
		},
		template: s,
		data: function() {
			return {}
		},
		methods: {}
	});
})();
