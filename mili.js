/* Global jQuery */
// DONE -init should have option to toggle with keyboard shortcut
// DONE - to start we can always init() it
// DONE - use delegate instead of assigning binding to all the elements
// DONE- Keyboard attributes
// DONE - copy the current selected element
// attach keyboard help

(function($, window, document) {
  const defaults = {
    offsetVertical: 10, // Vertical offset
    offsetHorizontal: 10 // Horizontal offset
  };
  function Tooltip(element) {
    this.init({});
  }

  Tooltip.prototype = {
    init: function(options) {
      const $this = this;
      this.$dataTestAttributeValue = "";
      this.testAttribute = options.testDataAttribute || "data-test";
      this.toggleTooltip();

      $("body").keydown(function(event) {
        if (event.ctrlKey && event.altKey && event.keyCode === 84) {
          $this.toggleTooltip();
        }
        // copy data test attribute
        if (event.ctrlKey && event.altKey && event.keyCode === 69) {
          $this.copyToClipboard($this.$dataTestAttributeValue);
        }
      });
    },
    setCurrentTestDataAttributeValue: value => {
      this.$dataTestAttributeValue = value;
    },
    getCurrentTestDataAttributeValue: () => {
      return this.$dataTestAttributeValue;
    },
    addTooltip: () => {
      const $this = this;
      const title = this.getCurrentTestDataAttributeValue.call($this);
      const tooltip = $('<div class="tiptop"></div>').text(title);
      tooltip.appendTo("body");
    },
    enableTooltip: function() {
      var $this = this;
      var testDataAttribute = this.testAttribute || "e2e-test";

      $("body")
        .off("mouseenter", `[${testDataAttribute}]`, function(e) {})
        .off("mouseleave", `[${testDataAttribute}]`, function(e) {})
        .off("mousemove", `[${testDataAttribute}]`, function(e) {})
        .on("mouseenter", `[${testDataAttribute}]`, event => {
          const $targetElement = $(event.target);
          var title = $($targetElement).attr(testDataAttribute);
          $this.$dataTestAttributeValue = title;
          if (title) {
            $($targetElement).addClass("showE2ETestTooltip");
            // add tooltip

            // const title = this.getCurrentTestDataAttributeValue();
            // $this.$dataTestAttributeValue = title;
            const title = $this.$dataTestAttributeValue;
            const { setCurrentTestDataAttributeValue } = $this;
            setCurrentTestDataAttributeValue.bind($this);
            setCurrentTestDataAttributeValue(title);
            const tooltip = $('<div class="tiptop"></div>').text(title);
            tooltip.appendTo("body");
            // $this.addTooltip.call($this);
          }
        })
        .on("mouseleave", `[${testDataAttribute}]`, function(e) {
          const $targetElement = $(e.target);
          $($targetElement).removeClass("showE2ETestTooltip");
          $(".tiptop").remove();
          $($targetElement).attr("title", $(this).data("title"));
        })
        .on("mousemove", `[${testDataAttribute}]`, function(e) {
          var tooltip = $(".tiptop"),
            top = e.pageY + defaults.offsetVertical,
            bottom = "auto",
            left = e.pageX + defaults.offsetHorizontal,
            right = "auto";

          if (
            top + tooltip.outerHeight() >=
            $(window).scrollTop() + $(window).height()
          ) {
            bottom = $(window).height() - top + defaults.offsetVertical * 2;
            top = "auto";
          }
          if (left + tooltip.outerWidth() >= $(window).width()) {
            right = $(window).width() - left + defaults.offsetHorizontal * 2;
            left = "auto";
          }

          $(".tiptop").css({
            top: top,
            bottom: bottom,
            left: left,
            right: right
          });
        });
    },
    disableTooltip: function() {
      var testDataAttribute = this.testAttribute || "e2e-test";
      $("body")
        .off("mouseenter", `[${testDataAttribute}]`, function(e) {})
        .off("mouseleave", `[${testDataAttribute}]`, function(e) {})
        .off("mousemove", `[${testDataAttribute}]`, function(e) {});
    },
    toggleTooltip: function() {
      const $this = this;
      if ($("body").hasClass("e2eTestTooltip")) {
        $("body").removeClass("e2eTestTooltip");
        // disable tooltip
        $this.disableTooltip();
      } else {
        $("body").addClass("e2eTestTooltip");
        // enable tooltip
        $this.enableTooltip();
      }
    },
    copyToClipboard: copyText => {
      const tmpInput = document.createElement("input");
      tmpInput.style.opacity = 0;
      tmpInput.value = copyText;
      document.body.appendChild(tmpInput);
      tmpInput.select();
      document.execCommand("copy");
      document.body.removeChild(tmpInput);
    }
  };

  var pluginName = "tooltip";
  $.fn[pluginName] = function() {
    new Tooltip(this);
  };
})(jQuery, window, document);
