(function() {
  var componentName = 'footer-bar';
  var s = `
    <div class="footer-bar side-bar">
      
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
