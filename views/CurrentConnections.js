(function() {
  var componentName = 'current-connections';
  var s = `
    <div class="current-connections">
      <h3>Current Connections</h3>
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
