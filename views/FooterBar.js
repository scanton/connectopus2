(function() {
	var componentName = 'footer-bar';
	var s = `
		<div class="footer-bar side-bar">
			<div class="label pull-right right-label">
				{{rightLabel}}
			</div>
			<div class="label left-label">
				{{leftLabel}}
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
				leftLabel: '',
				rightLabel: ''
			}
		},
		methods: {
			setRightLabel: function(label) {
				this.rightLabel = label;	
			},
			setLeftLabel: function(label) {
				this.leftLabel = label;	
			}
		}
	});
})();
