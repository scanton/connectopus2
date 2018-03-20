(function() {
	var componentName = 'active-connection';
	var s = `
		<div v-bind:style="getStyle()" v-on:mouseover="handleMouseOver" v-on:mouseout="handleMouseOut" v-bind:class="[con.status, {'is-prime': con.isPrime}]" class="active-connection">
			<div style="left: -350px" class="rollover-flag">{{con.name}}</div>
			<div v-show="!con.isPrime" v-bind:class="con.status" class="status-icon">
				<span class="highlight"></span>
			</div>
			<span v-show="con.isPrime" v-bind:class="con.status" class="glyphicon glyphicon-star"></span>
		</div>
	`;
	var calculateColors = function(index, connections) {
		var color;
		var halfCon = Math.ceil(connections/2);
		if(index % 2) {
			index = halfCon + ((index + 1) / 2);
		} else {
			index /= 2;
		}
		var angle = (360 * (index / (connections + 1)));
		angle += 120;
		while(angle > 360) {
			angle -= 360;
		}
		if(angle >= 210 || (angle >= 0 && angle < 40)) {
			color = "white";
		} else {
			color = "black";
		}
		return {index: index, connections: connections, angle: angle, color: color};
	}
	Vue.component(componentName, {
		created: function() {
			viewController.registerView(componentName, this);
		},
		props: ['con', 'index', 'connections'],
		template: s,
		data: function() {
			return {}
		},
		methods: {
			getStyle: function() {
				var colors = calculateColors(this.index, this.connections);
				return "background: hsla(" + colors.angle + ", 100%, 50%, .5); color: " + colors.color + ";";
			},
			getFlagStyle: function() {
				var colors = calculateColors(this.index, this.connections);
				return "left: -350px; background: hsl(" + colors.angle + ", 100%, 50%); color: " + colors.color + ";";
			},
			handleMouseOut: function(e) {
				var colors = calculateColors(this.index, this.connections);
				$(e.target).closest(".active-connection").find(".rollover-flag").attr("style", "left: -350px; background: hsl(" + colors.angle + ", 100%, 50%); color: " + colors.color + ";");
			},
			handleMouseOver: function(e) {
				var colors = calculateColors(this.index, this.connections);
				$(e.target).closest(".active-connection").find(".rollover-flag").attr("style", "left: 30px; background: hsl(" + colors.angle + ", 100%, 50%); color: " + colors.color + ";");
			}
		}
	});
})();
