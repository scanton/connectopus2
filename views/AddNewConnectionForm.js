(function() {
	var componentName = 'add-new-connection-form';
	var s = `
		<div class="add-new-connection-form container-fluid">
			<div class="row">
				<div class="col-xs-12">
					<h3>Add New Connection</h3>
					<form>
						<div class="input-group" v-bind:class="{'is-not-selected': isNotSelected()}">
							<span class="input-group-addon">Connection Type</span>
							<div class="dropdown">
							  <button class="btn btn-default dropdown-toggle" type="button" id="dropdownMenu1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
							    {{connectionType}}
							    <span class="caret"></span>
							  </button>
							  <ul v-on:click="handleConnectionTypeChange" class="dropdown-menu">
							    <li><a href="#">Local Directory</a></li>
							    <li><a href="#">Git (local)</a></li>
							    <li><a href="#">Git Clone (remote)</a></li>
							    <li><a href="#">Remote (SFTP)</a></li>
							  </ul>
							</div>
						</div>
						<div class="input-collection-div" v-show="connectionType != 'select connection type'">
							<div class="input-group">
								<span class="input-group-addon">Name</span>
								<input type="text" name="name" />
							</div>
							<div class="input-group" v-show="connectionType == 'Local Directory' || connectionType == 'Git (local)'">
								<span class="input-group-addon">Directory Path</span>
								<input type="text" name="directory-path" />
							</div>
							<div class="input-group" v-show="connectionType == 'Git Clone (remote)' || connectionType == 'Remote (SFTP)'">
								<span class="input-group-addon">Host</span>
								<input type="text" name="ssh-host" />
							</div>
							<div class="input-group" v-show="connectionType == 'Git Clone (remote)' || connectionType == 'Remote (SFTP)'">
								<span class="input-group-addon">Port</span>
								<input type="text" name="ssh-port" />
							</div>
							<div class="input-group" v-show="connectionType == 'Git Clone (remote)' || connectionType == 'Remote (SFTP)'">
								<span class="input-group-addon">Username</span>
								<input type="text" name="ssh-username" />
							</div>
							<div class="input-group" v-show="connectionType == 'Git Clone (remote)' || connectionType == 'Remote (SFTP)'">
								<span class="input-group-addon">Password</span>
								<input type="password" name="ssh-password" />
							</div>
						</div>
					</form>
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
				connectionType: 'select connection type'
			}
		},
		methods: {
			isNotSelected: function() {
				return this.connectionType == 'select connection type';
			},
			handleConnectionTypeChange: function(e) {
				e.preventDefault();
				this.connectionType = $(e.target).text();
			}
		}
	});
})();
