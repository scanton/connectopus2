(function() {
  var componentName = 'category-side-bar';
  var s = `
    <div class="category-side-bar side-bar">
      <ul>
        <li title="Connections" v-on:click="toggleContext">
          <span class="glyphicon glyphicon glyphicon-retweet"></span>
        </li>
        <li title="Content" v-on:click="toggleContext">
          <span class="glyphicon glyphicon-hdd"></span>
        </li>
        <li title="Code" v-on:click="toggleContext">
          <span class="glyphicon glyphicon-duplicate"></span>
        </li>
      </ul>
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
    methods: {
      toggleContext: function(e) {
        e.preventDefault();
        viewController.callViewMethod("work-area", "toggleContext");
      }
    }
  });
})();
