(function() {
	var componentName = 'diff-view';
	var s = `
		<div class="diff-view container-fluid">
			<div class="row">
				<div class="col-xs-12">
					<table class="diff-compare">
						<th class="added">
							{{addCount()}} Additions
						</th>
						<th class="removed">
							{{removeCount()}} Removals
						</th>
						<tr v-bind:class="{'added': item.added, 'removed': item.removed}" v-for="item in diffData">
							<td>
								<span v-show="!item.removed">
									<pre>{{item.value}}</pre>
								</span>
							</td>
							<td>
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
				diffData: []
			}
		},
		methods: {
			show: function(data) {
				this.diffData = data.diff;
				console.log(data);
			},
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
