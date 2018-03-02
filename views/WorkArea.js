(function() {
  var componentName = 'work-area';
  var s = `
    <div class="work-area">
      <top-nav></top-nav>
      <main-view></main-view>
      <context-side-bar></context-side-bar>
      <settings-side-bar></settings-side-bar>
      <category-side-bar></category-side-bar>
      <footer-bar></footer-bar>
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
      toggleSettings: function() {
        var $workArea = $(".work-area");
        if($workArea.hasClass("settings-is-visible")) {
          $workArea.removeClass("settings-is-visible");
        } else {
          $workArea.addClass("settings-is-visible");
        }
      },
      toggleContext: function() {
        var $workArea = $(".work-area");
        if($workArea.hasClass("context-is-visible")) {
          $workArea.removeClass("context-is-visible");
        } else {
          $workArea.addClass("context-is-visible");
        }
      }
    }
  });
})();
