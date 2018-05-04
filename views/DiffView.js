(function() {
	var componentName = 'diff-view';
	var s = `
		<div v-show="isVisible && category == 'files'" class="diff-view container-fluid">
			<div class="row">
				<div class="col-xs-12 main-diff-container" style="padding-right: 0; padding-left: 14px;">
					<!--<div class="mini-map-rail"></div>-->
					<table class="mini-map">
						<tr>
							<th v-bind:style="getStyle(0, primeColor)"></th>
							<th v-bind:style="getStyle(compareIndex, compareColor)"></th>
						</tr>
						<tr>
							<td class="added"></td>
							<td class="removed"></td>
						</tr>
						<tr v-for="(item, index) in diffData">
							<td v-bind:style="getStyle(0, primeColor)" v-bind:class="{'added': item.added, 'removed': item.removed}"></td>
							<td v-bind:style="getStyle(compareIndex, compareColor)" v-bind:class="{'added': item.added, 'removed': item.removed}"></td>
						</tr>
					</table>
					<h3 class="diff-tool-bar">
						<button v-on:click="hideView" class="btn btn-success">
							<span class="glyphicon glyphicon-remove"></span>
						</button>
						<button v-on:click="saveMerge" v-show="mergeEnabled" class="pull-right btn btn-default save-merge-button left-margin">
							<span>Save Merge</span>
						</button>
						<button class="pull-right btn btn-default" v-on:click="toggleMerge">
							<span v-show="!mergeEnabled">Merge Documents</span>
							<span v-show="mergeEnabled">Hide Merge</span>
						</button>
						<span class="change-count pull-right">{{addCount()}} Additions/{{removeCount()}} Removals</span>
						{{path}}
					</h3>
					<table class="diff-compare">
						<tr class="table-head">
							<th class="line-number" v-bind:style="getStyle(0, primeColor)"></th>
							<th v-bind:style="getStyle(0, primeColor)"><h2>{{primeName}}<h2></th>
							<th v-show="mergeEnabled" class="merge-column"></th>
							<th v-show="mergeEnabled" class="merge-column"><h2>Merged</h2></th>
							<th v-show="mergeEnabled" class="merge-column"></th>
							<th class="line-number" v-bind:style="getStyle(compareIndex, compareColor)"></th>
							<th v-bind:style="getStyle(compareIndex, compareColor)"><h2>{{compareName}}<h2></th>
						</tr>
						<tr class="totals">
							<td class="added line-number"></td>
							<td class="added">
								<h3>{{addCount()}} Additions</h3>
							</td>
							<td v-show="mergeEnabled" class="merge-column"></td>
							<td v-show="mergeEnabled" class="merge-column"></td>
							<td v-show="mergeEnabled" class="merge-column"></td>
							<td class="removed line-number"></td>
							<td class="removed">
								<h3>{{removeCount()}} Removals</h3>
							</td>
						</tr>
						<tr v-for="(item, index) in diffData" v-bind:class="{'in-sync': !item.added && !item.removed}">
							<td class="line-number prime-file" v-bind:style="getStyle(0, primeColor)" v-bind:class="{'added': item.added, 'removed': item.removed}">
								<span class="line-counter">{{item.primeLineCount}}</span>
							</td>
							<td v-bind:style="getStyle(0, primeColor)" v-bind:class="{'added': item.added, 'removed': item.removed}">
								<span v-show="!item.removed">
									<pre>{{item.value}}</pre>
								</span>
							</td>


							<td v-show="mergeEnabled" v-bind:class="{'added': item.added, 'removed': item.removed}" class="merge-column">
								<button v-on:click="pushLeftToRight" class="btn btn-default push-left-to-right-button diff-button">></button>
								<button v-on:click="removeLeftMerge" class="btn btn-default undo-left-to-right-button diff-button"><</button>
							</td>
							<td v-show="mergeEnabled" v-bind:data-index="index" v-bind:class="{'added': item.added, 'removed': item.removed}" class="merge-column value-column">
								<span>
									<pre>{{item.value}}</pre>
								</span>
							</td>
							<td v-show="mergeEnabled" v-bind:class="{'added': item.added, 'removed': item.removed}" class="merge-column">
								<button v-on:click="pushRightToLeft" class="btn btn-default push-right-to-left-button diff-button"><</button>
								<button v-on:click="removeRightMerge" class="btn btn-default undo-right-to-left-button diff-button">></button>
							</td>


							<td class="line-number compare-file" v-bind:style="getStyle(compareIndex, compareColor)" v-bind:class="{'added': item.added, 'removed': item.removed}">
								<span class="line-counter">{{item.compareLineCount}}</span>
							</td>
							<td v-bind:style="getStyle(compareIndex, compareColor)" v-bind:class="{'added': item.added, 'removed': item.removed}">
								<span v-show="!item.added">
									<pre>{{item.value}}</pre>
								</span>
							</td>
						</tr>
					</table>

					<div class="mini-map-scroll-indicator"></div>
				</div>
			</div>
		</div>
	`;
	
	Vue.component(componentName, {
		created: function() {
			viewController.registerView(componentName, this);
		},
		mounted: function() {
			var minMapVerticalOffset = 76;
			var handle = $(".mini-map-scroll-indicator");
			$(".diff-view").scroll(function(e) {
				var dv = $(".diff-view");
				var scrollPosition = dv.scrollTop();
				var visibleHeight = dv.height() - 20;
				var totalHeight = dv.find(".main-diff-container").height();
				var maxVerticalScroll = totalHeight - visibleHeight;
				var $miniMap = dv.find(".mini-map");
				var minMapHeight = $miniMap.height();
					var percentScroll = scrollPosition / maxVerticalScroll;
					var minMapRange = minMapHeight - visibleHeight + 26;
					var minMapScroll = minMapVerticalOffset - (percentScroll * minMapRange);
					$miniMap.attr("style", "top: " + minMapScroll + "px");
					var handleHeight = ((visibleHeight - minMapVerticalOffset) / maxVerticalScroll) * minMapHeight;
					var handleTop =  minMapVerticalOffset + (percentScroll * (visibleHeight - $(".diff-tool-bar").height() - handleHeight));
					handle.attr("style", "height: " + handleHeight + "px; top: " + handleTop + "px");
				
			});
		},
		template: s,
		props: ["category"],
		data: function() {
			return {
				compareColor: {},
				compareIndex: -1,
				compareConId: null,
				compareName: "",
				diffData: [],
				isVisible: false,
				maximizeContrast: false,
				mergeEnabled: false,
				path: "",
				primeColor: {},
				primeName: "",
				totalConnections: 0
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
				if(e) {
					e.preventDefault();
				}
				controller.setContextVisible(true);
				this.isVisible = false;
			},
			pushLeftToRight: function(e) {
				e.preventDefault();
				$(e.target).closest("tr").addClass("merge-left");
			},
			pushRightToLeft: function(e) {
				e.preventDefault();
				$(e.target).closest("tr").addClass("merge-right");
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
			},
			removeLeftMerge: function(e) {
				e.preventDefault();
				$(e.target).closest("tr").removeClass("merge-left");
			},
			removeRightMerge: function(e) {
				e.preventDefault();
				$(e.target).closest("tr").removeClass("merge-right");
			},
			saveMerge: function(e) {
				var a = [];
				$(".main-diff-container .value-column pre").filter(":visible").each(function(index) {
					a.push($(this).text());
				});
				var docText = a.join("\n");
				while(docText.split("\n\n").length > 1) {
					docText = docText.split("\n\n").join("\n");
				}
				controller.saveMerge(docText, this.path, this.compareConId);
			},
			setMaximizeContrast: function(bool) {
				this.maximizeContrast = bool;
			},
			show: function(data) {
				this.mergeEnabled = false;
				this.compareColor = utils.calculateColors(data.compareIndex, data.totalConnections, this.maximizeContrast);
				this.primeColor = utils.calculateColors(0, data.totalConnections, this.maximizeContrast);
				this.path = data.path;
				this.primeName = data.primeName;
				this.compareName = data.compareName;
				this.totalConnections = data.totalConnections;
				this.compareIndex = data.compareIndex;
				this.isVisible = true;
				this.compareConId = data.conId;
				controller.setContextVisible(false);
				var a = [];
				var l = data.diff.length;
				var a2, l2, d;
				var primeLineCount = 0;
				var compareLineCount = 0;
				for(var i = 0; i < l; i++) {
					d = data.diff[i];
					if(d) {
						a2 = d.value.split("\n");
						var l2 = a2.length;
						for(var i2 = 0; i2 < l2; i2++) {
							if(d.removed) {
								++compareLineCount;
							} else if(d.added) {
								++primeLineCount;
							} else {
								++primeLineCount;
								++compareLineCount;
							}
							a.push({count: 1, value: a2[i2], added: d.added, removed: d.removed, primeLineCount: primeLineCount, compareLineCount: compareLineCount});
						}
					}
				}
				this.diffData = a;
			},
			toggleMerge: function() {
				if(!this.mergeEnabled) {
					$("tr.merge-left").removeClass("merge-left");
					$("tr.merge-right").removeClass("merge-right");
				}
				this.mergeEnabled = !this.mergeEnabled;
			}
		}
	});
})();
