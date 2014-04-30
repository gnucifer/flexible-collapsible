(function($) {
  $.fn.flexible_collapsible = function(options) {

      if(this.data('flexible_collapsible_api')) {
        return this.data('flexible_collapsible_api');
      }

      var $self = this;
      var options = options || {};
      options.classes = 'classes' in options ? options.classes : [];
      options.expanded = 'expanded' in options ? options.expanded : false;
      options.close_text = 'close_text' in options ? options.close_text : false;
      options.expand_text = 'expand_text' in options ?  options.expand_text : false;
      options.close_data_icon = 'close_data_icon' in options ? options.close_data_icon : false;
      options.expand_data_icon = 'expand_data_icon' in options ? options.expand_data_icon : false;
      options.expanded_class = 'expanded';
      options.duration = 'duration' in options ? options.duration : 400;

      options.label = 'label' in options ? options.label : options.button;

      options.element = 'element' in options ? options.element : $self;

      options.instant_state_change = 'instant_state_change' in options ? options.instant_state_change : true;

      options.enabled = 'enabled' in options ? options.enabled : true;

      var state = {
        expanded : !options.expanded,
        enabled : true,
      };

      //TODO: cleanup
      var $element = options.element;
      var $button = options.button;
      var $label = options.label;

      //TODO: Remove this option?
      for(i in options.classes) {
        $element.addClass(options.classes[i]);
      }

      var close = function(instant) {
        if(!state.expanded) {
          return;
        }
        state.expanded = false;

        var instant = instant || false;
        var after = function () {
          $button.removeClass(options.expanded_class);
          if(options.expand_text) {
            $label.text(options.expand_text);
          }
          if(options.close_data_icon) {
            $label.removeAttr('data-icon');
          }
          if(options.expand_data_icon) {
            $label.attr('data-icon', options.expand_data_icon);
          }
          $self.trigger('close');
        };
        if(instant) {
          $element.hide();
          after();
        }
        else {
          if(options.instant_state_change) {
            $element.slideUp({
                duration : options.duration,
              });
            after();
          }
          else {
            $element.slideUp({
                duration : options.duration,
                complete : after
              });
          }
        }
      };
      var expand = function(instant) {
        if(state.expanded) {
          return;
        }
        state.expanded = true;

        var instant = instant || false;
        var after = function () {
          $button.addClass(options.expanded_class);
          if(options.close_text) {
            $label.text(options.close_text);
          } 
          if(options.expand_data_icon) {
            $label.removeAttr('data-icon');
          }
          if(options.close_data_icon) {
            $label.attr('data-icon', options.close_data_icon);
          }
          $self.trigger('expand');
        };
        if(instant) {
          $element.show();
          after();
        }
        else {
          if(options.instant_state_change) {
            $element.slideDown({
                duration : options.duration,
              });
            after();
          }
          else {
            $element.slideDown({
                duration : options.duration,
                complete : after
              });
          }
        }
      };

      if(options.expanded) {
        expand(true);
      }
      else {
        close(true);
      }

      var toggle_expandable = function(e) {
        e.preventDefault();
        if($button.hasClass(options.expanded_class)) {
          close();
        }
        else {
          expand();
        }
      };

      $button.click(toggle_expandable);

      //return api in api-functions? brainfuck
      var destroy = function () {
        $button.unbind('click', toggle_expandable);
        $self.removeData('flexible_collapsible_api');
        return $self;
      };

      var disable = function () {
        if(!state.enabled) {
          return;
        }
        state.enabled = false;
        $button.unbind('click', toggle_expandable);
        $label.hide();
      }
      
      //TODO: prevent from calling multiple times, store state enabled/disabled
      var enable = function () {
        if(state.enabled) {
          return;
        }
        state.enabled = true;
        $button.bind('click', toggle_expandable);
        $label.show();
      }

      if(!options.enabled) {
        disable();
      }

      //Save api
      this.data('flexible_collapsible_api', {
        'close' : close,
        'expand' : expand,
        'destroy' : destroy,
        'disable' : disable,
        'enable' : enable,
        'expanded' : function() { return state.expanded; },
        'disabled' : function() { return state.enabled; }
        //TODO: toggle?
      });
      return this;
    }

})(jQuery);
