(function() {
	var componentName = 'diff-view';
	var s = `
		<div v-show="isVisible" class="diff-view container-fluid">
			<div class="row">
				<div class="col-xs-12">
					<h3><button v-on:click="hideView" class="btn btn-default">Close</button> {{path}}</h3>
					<table class="diff-compare">
						<tr>
							<th v-bind:style="getStyle(0, primeColor)"><h2>{{primeName}}<h2></th>
							<th v-bind:style="getStyle(compareIndex, compareColor)"><h2>{{compareName}}<h2></th>
						</tr>
						<tr>
							<td class="added">
								<h3>{{addCount()}} Additions</h3>
							</td>
							<td class="removed">
								<h3>{{removeCount()}} Removals</h3>
							</td>
						</tr>
						<tr v-for="item in diffData">
							<td v-bind:style="getStyle(0, primeColor)" v-bind:class="{'added': item.added, 'removed': item.removed}">
								<span v-show="!item.removed">
									<pre>{{item.value}}</pre>
								</span>
							</td>
							<td v-bind:style="getStyle(compareIndex, compareColor)" v-bind:class="{'added': item.added, 'removed': item.removed}">
								<span v-show="!item.added">
									<pre>{{item.value}}</pre>
								</span>
							</td>
							
						</tr>
					</table>
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
			return {
				diffData: [],
				path: "",
				primeName: "",
				compareName: "",
				totalConnections: 0,
				compareIndex: -1,
				isVisible: false,
				maximizeContrast: false,
				compareColor: {},
				primeColor: {}
			}
		},
		methods: {
			addCount: function() {
				var count = 0;
				var l = this.diffData.length;
				while(l--) {
					if(this.diffData[l].added) {
						++count;
					}
				}
				return count;
			},
			getStyle: function(index, color) {
				var c = controller.getColorStyle();
				return "background-color: hsl(" + color.angle + ", " + c.saturation + ", " + c.luminance + ");"
			},
			hideView: function(e) {
				e.preventDefault();
				this.isVisible = false;
			},
			setMaximizeContrast: function(bool) {
				this.maximizeContrast = bool;
			},
			show: function(data) {
				this.compareColor = utils.calculateColors(data.compareIndex, data.totalConnections, this.maximizeContrast);
				this.primeColor = utils.calculateColors(0, data.totalConnections, this.maximizeContrast);
				this.path = data.path;
				this.primeName = data.primeName;
				this.compareName = data.compareName;
				this.totalConnections = data.totalConnections;
				this.compareIndex = data.compareIndex;
				this.diffData = data.diff;
				this.isVisible = true;
			},
			removeCount: function() {
				var count = 0;
				var l = this.diffData.length;
				while(l--) {
					if(this.diffData[l].removed) {
						++count;
					}
				}
				return count;
			}
		}
	});
})();
