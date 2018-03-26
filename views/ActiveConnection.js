(function() {
	var componentName = 'active-connection';
	var s = `
		<div v-bind:style="getStyle()" v-on:mouseover="handleMouseOver" v-on:mouseout="handleMouseOut" v-bind:class="[con.status, {'is-prime': con.isPrime}]" class="active-connection">
			<div v-bind:style="getFlagStyle()" class="rollover-flag">{{con.name}}</div>
			<div v-show="!con.isPrime" v-bind:class="con.status" class="status-icon">
				<span class="highlight"></span>
			</div>
			<span v-show="con.isPrime" v-bind:class="con.status" class="glyphicon glyphicon-star"><span class="highlight"></span></span>
			<span v-show="index != connections - 1" v-bind:style="getArrowStyle()" class="glyphicon glyphicon-triangle-bottom"></span>
		</div>
	`;
	Vue.component(componentName, {
		created: function() {
			viewController.registerView(componentName, this);
		},
		props: ['con', 'index', 'connections'],
		template: s,
		data: function() {
			return {
				maximizeContrast: controller.getSettings().maximizeContrast,
				hue: 0,
				lumenance: "67%",
				saturation: "40%"
			}
		},
		methods: {
			getStyle: function() {
				var colors = utils.calculateColors(this.index, this.connections, this.maximizeContrast);
				return "background: hsl(" + colors.angle + ", " + this.lumenance + ", " + this.saturation + "); color: " + colors.color + ";";
			},
			getArrowStyle: function() {
				var colors = utils.calculateColors(this.index, this.connections, this.maximizeContrast);
				return "color: hsl(" + colors.angle + ", " + this.lumenance + ", " + this.saturation + ");";
			},
			getFlagStyle: function() {
				var colors = utils.calculateColors(this.index, this.connections, this.maximizeContrast);
				return "left: -350px; background: hsl(" + colors.angle + ", " + this.lumenance + ", " + this.saturation + "); color: " + colors.color + ";";
			},
			handleMouseOut: function(e) {
				var colors = utils.calculateColors(this.index, this.connections, this.maximizeContrast);
				$(e.target).closest(".active-connection").find(".rollover-flag").attr("style", "left: -350px; background: hsl(" + colors.angle + ", " + this.lumenance + ", " + this.saturation + "); color: " + colors.color + ";");
			},
			handleMouseOver: function(e) {
				var colors = utils.calculateColors(this.index, this.connections, this.maximizeContrast);
				$(e.target).closest(".active-connection").find(".rollover-flag").attr("style", "left: 30px; background: hsl(" + colors.angle + ", " + this.lumenance + ", " + this.saturation + "); color: " + colors.color + ";");
			},
			setMaximizeContrast: function(bool) {
				this.maximizeContrast = bool;
			}
		}
	});
})();
