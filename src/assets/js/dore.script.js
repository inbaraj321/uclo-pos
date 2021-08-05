function run2Script(){
/* Dore Main Script 

Table of Contents

01. Utils
02. Shift Select
03. Dore Main Plugin
  03.01. Getting Colors from CSS
  03.02. Resize
  03.03. Search
  03.04. Shift Selectable Init
  03.05. Menu
  03.06. App Menu
  03.07. Survey App
  03.08. Rotate Button
  03.09. Charts
  03.10. Calendar
  03.11. Datatable
  03.12. Notification
  03.13. Dropdown Select
  03.14. Slick Slider
  03.15. Form Validation
  03.16. Tooltip
  03.17. Popover
  03.18. Select 2
  03.19. Datepicker
  03.20. Dropzone
  03.21. Cropperjs
  03.22. Range Slider
  03.23. Modal Passing Content
  03.24. Scrollbar
  03.25. Progress
  03.26. Rating
  03.27. Tags Input
  03.28. Sortable
  03.29. State Button
  03.30. Typeahead
  03.31. Full Screen
  03.32. Html Editors
  03.33. Showing Body
  03.34. Keyboard Shortcuts
  03.35. Context Menu
  03.36. Select from Library 
  03.37. Feedback
  03.38. Smart Wizard
  03.39. Countdown
  03.40. Lightbox
  03.41. Ellipsis
  03.42. Glide
  03.43. Validation
*/

/* 01. Utils */
$.fn.addCommas = function (nStr) {
  nStr += "";
  var x = nStr.split(".");
  var x1 = x[0];
  var x2 = x.length > 1 ? "." + x[1] : "";
  var rgx = /(\d+)(\d{3})/;
  while (rgx.test(x1)) {
    x1 = x1.replace(rgx, "$1" + "," + "$2");
  }
  return x1 + x2;
};

// State Button
(function ($) {
  $.fn.stateButton = function (options) {
    if (this.length > 1) {
      this.each(function () { $(this).stateButton(options) });
      return this;
    }

    this.initialize = function () {
      return this;
    };

    this.showSpinner = function () {
      $(this).addClass("show-spinner");
      $(this).addClass("active");
      return this;
    };

    this.hideSpinner = function () {
      $(this).removeClass("show-spinner");
      return this;
    };

    this.showFail = function (tooltip) {
      $(this).addClass("show-fail");
      $(this).removeClass("show-spinner");
      if (tooltip) {
        $(this).find(".icon.fail").tooltip("show");
      }
      return this;
    };

    this.showSuccess = function (tooltip) {
      $(this).addClass("show-success");
      $(this).removeClass("show-spinner");
      if (tooltip) {
        $(this).find(".icon.success").tooltip("show");
      }
      return this;
    };

    this.reset = function () {
      this.hideTooltips();
      this.hideSpinner();
      $(this).removeClass("show-success");
      $(this).removeClass("show-fail");
      $(this).removeClass("active");
    }

    this.hideTooltips = function () {
      this.hideFailTooltip();
      this.hideSuccessTooltip();
      return this;
    };

    this.showSuccessTooltip = function () {
      $(this).find(".icon.success").tooltip("show");
      return this;
    };

    this.hideSuccessTooltip = function () {
      $(this).find(".icon.success").tooltip("dispose");
      return this;
    };

    this.showFailTooltip = function () {
      $(this).find(".icon.fail").tooltip("show");
      return this;
    };

    this.hideFailTooltip = function () {
      $(this).find(".icon.fail").tooltip("dispose");
      return this;
    };

    return this.initialize();
  }
})(jQuery);

/* 02. Shift Select */
$.shiftSelectable = function (element, config) {
  var plugin = this;
  config = $.extend(
    {
      items: ".card"
    },
    config
  );
  var $container = $(element);
  var $checkAll = null;
  var $boxes = $container.find("input[type='checkbox']");
  var lastChecked;
  if ($container.data("checkAll")) {
    $checkAll = $("#" + $container.data("checkAll"));
    $checkAll.on("click", function () {
      $boxes.prop("checked", $($checkAll).prop("checked")).trigger("change");
      document.activeElement.blur();
      controlActiveClasses();
    });
  }

  function itemClick(checkbox, shiftKey) {
    $(checkbox)
      .prop("checked", !$(checkbox).prop("checked"))
      .trigger("change");

    if (!lastChecked) {
      lastChecked = checkbox;
    }
    if (lastChecked) {
      if (shiftKey) {
        var start = $boxes.index(checkbox);
        var end = $boxes.index(lastChecked);
        $boxes
          .slice(Math.min(start, end), Math.max(start, end) + 1)
          .prop("checked", lastChecked.checked)
          .trigger("change");
      }
      lastChecked = checkbox;
    }

    if ($checkAll) {
      var anyChecked = false;
      var allChecked = true;
      $boxes.each(function () {
        if ($(this).prop("checked")) {
          anyChecked = true;
        } else {
          allChecked = false;
        }
      });
      if (anyChecked) {
        $checkAll.prop("indeterminate", anyChecked);
      } else {
        $checkAll.prop("indeterminate", anyChecked);
        $checkAll.prop("checked", anyChecked);
      }
      if (allChecked) {
        $checkAll.prop("indeterminate", false);
        $checkAll.prop("checked", allChecked);
      }
    }
    document.activeElement.blur();
    controlActiveClasses();
  }

  $container.on("click", config.items, function (e) {
    if (
      $(e.target).is("a") ||
      $(e.target)
        .parent()
        .is("a")
    ) {
      return;
    }

    if ($(e.target).is("input[type='checkbox']")) {
      e.preventDefault();
      e.stopPropagation();
    }
    var checkbox = $(this).find("input[type='checkbox']")[0];
    itemClick(checkbox, e.shiftKey);
  });

  function controlActiveClasses() {
    $boxes.each(function () {
      if ($(this).prop("checked")) {
        $(this)
          .parents(".card")
          .addClass("active");
      } else {
        $(this)
          .parents(".card")
          .removeClass("active");
      }
    });
  }

  plugin.update = function () {
    $boxes = $container.find("input[type='checkbox']");
  }

  plugin.selectAll = function () {
    if ($checkAll) {
      $boxes.prop("checked", true).trigger("change");
      $checkAll.prop("checked", true);
      $checkAll.prop("indeterminate", false);
      controlActiveClasses();
    }
  };

  plugin.deSelectAll = function () {
    if ($checkAll) {
      $boxes.prop("checked", false).trigger("change");
      $checkAll.prop("checked", false);
      $checkAll.prop("indeterminate", false);
      controlActiveClasses();
    }
  };

  plugin.rightClick = function (trigger) {
    var checkbox = $(trigger).find("input[type='checkbox']")[0];
    if ($(checkbox).prop("checked")) {
      return;
    }
    plugin.deSelectAll();
    itemClick(checkbox, false);
  };
};

$.fn.shiftSelectable = function (options) {
  return this.each(function () {
    if (undefined == $(this).data("shiftSelectable")) {
      var plugin = new $.shiftSelectable(this, options);
      $(this).data("shiftSelectable", plugin);
    }
  });
};

/* 03. Dore Main Plugin */
  var defaults = {};
  var plugin = this;
  plugin.settings = {};
  var $element = $(element);
  var element = element;
  var $shiftSelect;
  var direction;
  var isRtl = false;

  function init() {
    options = options || {};
    plugin.settings = $.extend({}, defaults, options);
    setDirection();

    /* 03.01. Getting Colors from CSS */
    var rootStyle = getComputedStyle(document.body);
    var themeColor1 = rootStyle.getPropertyValue("--theme-color-1").trim();
    var themeColor2 = rootStyle.getPropertyValue("--theme-color-2").trim();
    var themeColor3 = rootStyle.getPropertyValue("--theme-color-3").trim();
    var themeColor4 = rootStyle.getPropertyValue("--theme-color-4").trim();
    var themeColor5 = rootStyle.getPropertyValue("--theme-color-5").trim();
    var themeColor6 = rootStyle.getPropertyValue("--theme-color-6").trim();
    var themeColor1_10 = rootStyle
      .getPropertyValue("--theme-color-1-10")
      .trim();
    var themeColor2_10 = rootStyle
      .getPropertyValue("--theme-color-2-10")
      .trim();
    var themeColor3_10 = rootStyle
      .getPropertyValue("--theme-color-3-10")
      .trim();
    var themeColor4_10 = rootStyle
      .getPropertyValue("--theme-color-4-10")
      .trim();

    var themeColor5_10 = rootStyle
      .getPropertyValue("--theme-color-5-10")
      .trim();
    var themeColor6_10 = rootStyle
      .getPropertyValue("--theme-color-6-10")
      .trim();

    var primaryColor = rootStyle.getPropertyValue("--primary-color").trim();
    var foregroundColor = rootStyle
      .getPropertyValue("--foreground-color")
      .trim();
    var separatorColor = rootStyle.getPropertyValue("--separator-color").trim();

    /* 03.02. Resize */
    var subHiddenBreakpoint = 1440;
    var searchHiddenBreakpoint = 768;
    var menuHiddenBreakpoint = 768;

    function onResize() {
      var windowHeight = $(window).outerHeight();
      var windowWidth = $(window).outerWidth();
      var navbarHeight = $(".navbar").outerHeight();

      var submenuMargin = parseInt(
        $(".sub-menu .scroll").css("margin-top"),
        10
      );

      if ($(".chat-app .scroll").length > 0 && chatAppScroll) {
        $(".chat-app .scroll").scrollTop(
          $(".chat-app .scroll").prop("scrollHeight")
        );
        chatAppScroll.update();
      }

      if (windowWidth < menuHiddenBreakpoint) {
        $("#app-container").addClass("menu-mobile");
      } else if (windowWidth < subHiddenBreakpoint) {
        $("#app-container").removeClass("menu-mobile");
        if ($("#app-container").hasClass("menu-default")) {
          $("#app-container").removeClass(allMenuClassNames);
          $("#app-container").addClass("menu-default menu-sub-hidden");
        }
      } else {
        $("#app-container").removeClass("menu-mobile");
        if (
          $("#app-container").hasClass("menu-default") &&
          $("#app-container").hasClass("menu-sub-hidden")
        ) {
          $("#app-container").removeClass("menu-sub-hidden");
        }
      }

      setMenuClassNames(0, true);
    }

    function setDirection() {
      if (typeof Storage !== "undefined") {
        if (localStorage.getItem("dore-direction")) {
          direction = localStorage.getItem("dore-direction");
        }
        isRtl = direction == "rtl" && true;
      }
    }

    $(window).on("resize", function (event) {
      if (event.originalEvent.isTrusted) {
        onResize();
      }
    });
    onResize();

    /* 03.03. Search */


    /* 03.04. Shift Selectable Init */
    $shiftSelect = $(".list").shiftSelectable();

    /* 03.05. Menu */
    var menuClickCount = 0;
    var allMenuClassNames = "menu-default menu-hidden sub-hidden main-hidden menu-sub-hidden main-show-temporary sub-show-temporary menu-mobile";
    function setMenuClassNames(clickIndex, calledFromResize, link) {
      menuClickCount = clickIndex;
      var container = $("#app-container");
      if (container.length == 0) {
        return;
      }

      var link = link || getActiveMainMenuLink();

      //menu-default no subpage
      if (
        $(".sub-menu ul[data-link='" + link + "']").length == 0 &&
        (menuClickCount == 2 || calledFromResize)
        ) {
          if ($(window).outerWidth() >= menuHiddenBreakpoint) {
            if (isClassIncludedApp("menu-default")) {
              if (calledFromResize) {
              $("#app-container").removeClass(allMenuClassNames);
              $("#app-container").addClass("menu-default menu-sub-hidden sub-hidden");
              menuClickCount = 0; // This one should be changed from 1 to 0
            } else {
              $("#app-container").removeClass(allMenuClassNames);
              $("#app-container").addClass("menu-default main-hidden menu-sub-hidden sub-hidden");
              menuClickCount = 0;
            }
            resizeCarousel();
            return;
          }
        }
      }

      //menu-sub-hidden no subpage
      if (
        $(".sub-menu ul[data-link='" + link + "']").length == 0 &&
        (menuClickCount == 1 || calledFromResize)
      ) {
        if ($(window).outerWidth() >= menuHiddenBreakpoint) {
          if (isClassIncludedApp("menu-sub-hidden")) {
            if (calledFromResize) {
              $("#app-container").removeClass(allMenuClassNames);
              $("#app-container").addClass("menu-sub-hidden sub-hidden");
              menuClickCount = 0;
            } else {
              $("#app-container").removeClass(allMenuClassNames);
              $("#app-container").addClass("menu-sub-hidden main-hidden sub-hidden");
              menuClickCount = -1;
            }
            resizeCarousel();
            return;
          }
        }
      }

      //menu-hidden no subpage
      if (
        $(".sub-menu ul[data-link='" + link + "']").length == 0 &&
        (menuClickCount == 1 || calledFromResize)
      ) {
        if ($(window).outerWidth() >= menuHiddenBreakpoint) {
          if (isClassIncludedApp("menu-hidden")) {
            if (calledFromResize) {
              $("#app-container").removeClass(allMenuClassNames);
              $("#app-container").addClass("menu-hidden main-hidden sub-hidden");
              menuClickCount = 0;
            } else {
              $("#app-container").removeClass(allMenuClassNames);
              $("#app-container").addClass("menu-hidden main-show-temporary");
              menuClickCount = 3;
            }
            resizeCarousel();
            return;
          }
        }
      }

      if (clickIndex % 4 == 0) {
        if (isClassIncludedApp("menu-main-hidden")) {
          nextClasses = "menu-main-hidden";
        } else if (
          isClassIncludedApp("menu-default") &&
          isClassIncludedApp("menu-sub-hidden")
        ) {
          nextClasses = "menu-default menu-sub-hidden";
        } else if (isClassIncludedApp("menu-default")) {
          nextClasses = "menu-default";
        } else if (isClassIncludedApp("menu-sub-hidden")) {
          nextClasses = "menu-sub-hidden";
        } else if (isClassIncludedApp("menu-hidden")) {
          nextClasses = "menu-hidden";
        }
        menuClickCount = 0;
      } else if (clickIndex % 4 == 1) {
        if (
          isClassIncludedApp("menu-default") &&
          isClassIncludedApp("menu-sub-hidden")
        ) {
          nextClasses = "menu-default menu-sub-hidden main-hidden sub-hidden";
        } else if (isClassIncludedApp("menu-default")) {
          nextClasses = "menu-default sub-hidden";
        } else if (isClassIncludedApp("menu-main-hidden")) {
          nextClasses = "menu-main-hidden menu-hidden";
        } else if (isClassIncludedApp("menu-sub-hidden")) {
          nextClasses = "menu-sub-hidden main-hidden sub-hidden";
        } else if (isClassIncludedApp("menu-hidden")) {
          nextClasses = "menu-hidden main-show-temporary";
        }
      } else if (clickIndex % 4 == 2) {
        if (isClassIncludedApp("menu-main-hidden") && isClassIncludedApp("menu-hidden")) {
          nextClasses = "menu-main-hidden";
        } else if (
          isClassIncludedApp("menu-default") &&
          isClassIncludedApp("menu-sub-hidden")
        ) {
          nextClasses = "menu-default menu-sub-hidden sub-hidden";
        } else if (isClassIncludedApp("menu-default")) {
          nextClasses = "menu-default main-hidden sub-hidden";
        } else if (isClassIncludedApp("menu-sub-hidden")) {
          nextClasses = "menu-sub-hidden sub-hidden";
        } else if (isClassIncludedApp("menu-hidden")) {
          nextClasses = "menu-hidden main-show-temporary sub-show-temporary";
        }
      } else if (clickIndex % 4 == 3) {
        if (isClassIncludedApp("menu-main-hidden")) {
          nextClasses = "menu-main-hidden menu-hidden";
        }
        else if (
          isClassIncludedApp("menu-default") &&
          isClassIncludedApp("menu-sub-hidden")
        ) {
          nextClasses = "menu-default menu-sub-hidden sub-show-temporary";
        } else if (isClassIncludedApp("menu-default")) {
          nextClasses = "menu-default sub-hidden";
        } else if (isClassIncludedApp("menu-sub-hidden")) {
          nextClasses = "menu-sub-hidden sub-show-temporary";
        } else if (isClassIncludedApp("menu-hidden")) {
          nextClasses = "menu-hidden main-show-temporary";
        }
      }
      if (isClassIncludedApp("menu-mobile")) {
        nextClasses += " menu-mobile";
      }
      container.removeClass(allMenuClassNames);
      container.addClass(nextClasses);
      resizeCarousel();
    }
    $(".menu-button").on("click", function (event) {
      event.preventDefault();
      // event.stopPropagation();
      setMenuClassNames(++menuClickCount);
    });

    $(".menu-button-mobile").on("click", function (event) {
      event.preventDefault();
      // event.stopPropagation();
      $("#app-container")
        .removeClass("sub-show-temporary")
        .toggleClass("main-show-temporary");
      return false;
    });

    $(".main-menu").on("click", "a", function (event) {
      event.preventDefault();
      // event.stopPropagation();
      var link = $(this)
        .attr("href")
        .replace("#", "");
      if ($(".sub-menu ul[data-link='" + link + "']").length == 0) {
        var target = $(this).attr("target");
        if ($(this).attr("target") == null) {
          window.open(link, "_self");
        } else {
          window.open(link, target);
        }
        return;
      }

      showSubMenu($(this).attr("href"));
      var container = $("#app-container");
      if (!$("#app-container").hasClass("menu-mobile")) {
        if (
          $("#app-container").hasClass("menu-sub-hidden") &&
          (menuClickCount == 2 || menuClickCount == 0)
        ) {
          setMenuClassNames(3, false, link);
        } else if (
          $("#app-container").hasClass("menu-hidden") &&
          (menuClickCount == 1 || menuClickCount == 3)
        ) {
          setMenuClassNames(2, false, link);
        } else if (
          $("#app-container").hasClass("menu-default") &&
          !$("#app-container").hasClass("menu-sub-hidden") &&
          (menuClickCount == 1 || menuClickCount == 3)
        ) {
          setMenuClassNames(0, false, link);
        }
      } else {
        $("#app-container").addClass("sub-show-temporary");
      }
      return false;
    });

    $(document).on("click", function (event) {
      if (
        !(
          $(event.target)
            .parents()
            .hasClass("menu-button") ||
          $(event.target).hasClass("menu-button") ||
          $(event.target)
            .parents()
          //   .hasClass("menu-button-mobile") ||
          // $(event.target).hasClass("menu-button-mobile") ||
          // $(event.target)
          //   .parents()
            .hasClass("sidebar") ||
          $(event.target).hasClass("sidebar")
        )
      ) {
        // Prevent sub menu closing on collapse click 
        if ($(event.target).parents("a[data-toggle='collapse']").length > 0 || $(event.target).attr("data-toggle") == 'collapse') {
          return;
        }
        if (
          $("#app-container").hasClass("menu-sub-hidden") &&
          menuClickCount == 3
        ) {
          var link = getActiveMainMenuLink();
          if (link == lastActiveSubmenu) {
            setMenuClassNames(2);
          } else {
            setMenuClassNames(0);
          }
        } else if ($("#app-container").hasClass("menu-main-hidden") && $("#app-container").hasClass("menu-mobile")) {
          setMenuClassNames(0);
        } else if (
          $("#app-container").hasClass("menu-hidden") ||
          $("#app-container").hasClass("menu-mobile")
        ) {
          setMenuClassNames(0);
        }
      }
    });

    function getActiveMainMenuLink() {
      var dataLink = $(".main-menu ul li.active a").attr("href");
      return dataLink ? dataLink.replace("#", "") : "";
    }

    function isClassIncludedApp(className) {
      var container = $("#app-container");
      var currentClasses = container
        .attr("class")
        .split(" ")
        .filter(function (x) {
          return x != "";
        });
      return currentClasses.includes(className);
    }

    var lastActiveSubmenu = "";
    function showSubMenu(dataLink) {
      if ($(".main-menu").length == 0) {
        return;
      }

      var link = dataLink ? dataLink.replace("#", "") : "";
      if ($(".sub-menu ul[data-link='" + link + "']").length == 0) {
        $("#app-container").removeClass("sub-show-temporary");

        if ($("#app-container").length == 0) {
          return;
        }

        if (
          isClassIncludedApp("menu-sub-hidden") ||
          isClassIncludedApp("menu-hidden")
        ) {
          menuClickCount = 0;
        } else {
          menuClickCount = 1;
        }
        $("#app-container").addClass("sub-hidden");
        noTransition();
        return;
      }
      if (link == lastActiveSubmenu) {
        return;
      }
      $(".sub-menu ul").fadeOut(0);
      $(".sub-menu ul[data-link='" + link + "']").slideDown(100);

      $(".sub-menu .scroll").scrollTop(0);
      lastActiveSubmenu = link;
    }

    function noTransition() {
      $(".sub-menu").addClass("no-transition");
      $("main").addClass("no-transition");
      setTimeout(function () {
        $(".sub-menu").removeClass("no-transition");
        $("main").removeClass("no-transition");
      }, 350);
    }

    showSubMenu($(".main-menu ul li.active a").attr("href"));

    function resizeCarousel() {
      setTimeout(function () {
        var event = document.createEvent("HTMLEvents");
        event.initEvent("resize", false, false);
        window.dispatchEvent(event);
      }, 350);
    }

    /* 03.06. App Menu */
    $(".app-menu-button").on("click", function (event) {
      event.preventDefault();
      if ($(".app-menu").hasClass("shown")) {
        $(".app-menu").removeClass("shown");
      } else {
        $(".app-menu").addClass("shown");
      }
    });

    $(document).on("click", function (event) {
      if (
        !(
          $(event.target)
            .parents()
            .hasClass("app-menu") ||
          $(event.target)
            .parents()
            .hasClass("app-menu-button") ||
          $(event.target).hasClass("app-menu-button") ||
          $(event.target).hasClass("app-menu")
        )
      ) {
        if ($(".app-menu").hasClass("shown")) {
          $(".app-menu").removeClass("shown");
        }
      }
    });

    

    /* 03.08. Rotate Button */
    $(document).on("click", ".rotate-icon-click", function () {
      $(this).toggleClass("rotate");
    });

    

    

    



    /* 03.21. Cropperjs */
    var Cropper = window.Cropper;
    if (typeof Cropper !== "undefined") {
      function each(arr, callback) {
        var length = arr.length;
        var i;

        for (i = 0; i < length; i++) {
          callback.call(arr, arr[i], i, arr);
        }

        return arr;
      }
      var previews = document.querySelectorAll(".cropper-preview");
      var options = {
        aspectRatio: 4 / 3,
        preview: ".img-preview",
        ready: function () {
          var clone = this.cloneNode();

          clone.className = "";
          clone.style.cssText =
            "display: block;" +
            "width: 100%;" +
            "min-width: 0;" +
            "min-height: 0;" +
            "max-width: none;" +
            "max-height: none;";
          each(previews, function (elem) {
            elem.appendChild(clone.cloneNode());
          });
        },
        crop: function (e) {
          var data = e.detail;
          var cropper = this.cropper;
          var imageData = cropper.getImageData();
          var previewAspectRatio = data.width / data.height;

          each(previews, function (elem) {
            var previewImage = elem.getElementsByTagName("img").item(0);
            var previewWidth = elem.offsetWidth;
            var previewHeight = previewWidth / previewAspectRatio;
            var imageScaledRatio = data.width / previewWidth;
            elem.style.height = previewHeight + "px";
            if (previewImage) {
              previewImage.style.width =
                imageData.naturalWidth / imageScaledRatio + "px";
              previewImage.style.height =
                imageData.naturalHeight / imageScaledRatio + "px";
              previewImage.style.marginLeft = -data.x / imageScaledRatio + "px";
              previewImage.style.marginTop = -data.y / imageScaledRatio + "px";
            }
          });
        },
        zoom: function (e) { }
      };

      if ($("#inputImage").length > 0) {
        var inputImage = $("#inputImage")[0];
        var image = $("#cropperImage")[0];

        var cropper;
        inputImage.onchange = function () {
          var files = this.files;
          var file;

          if (files && files.length) {
            file = files[0];
            $("#cropperContainer").css("display", "block");

            if (/^image\/\w+/.test(file.type)) {
              uploadedImageType = file.type;
              uploadedImageName = file.name;

              image.src = uploadedImageURL = URL.createObjectURL(file);
              if (cropper) {
                cropper.destroy();
              }
              cropper = new Cropper(image, options);
              inputImage.value = null;
            } else {
              window.alert("Please choose an image file.");
            }
          }
        };
      }
    }


    /* 03.24. Scrollbar */
    if (typeof PerfectScrollbar !== "undefined") {
      var chatAppScroll;
      $(".scroll").each(function () {
        if ($(this).parents(".chat-app").length > 0) {
          var scrollElement = $(this)[0];
          var $scrollContent = $(this).find(".scroll-content");
          var initialized = false;

          function createChatAppScroll() {
            chatAppScroll = new PerfectScrollbar(scrollElement, { suppressScrollX: true });
            chatAppScroll.isRtl = false;
            initialized = false;
          }

          function calculateHeight() {
            var elementsHeight = 0;
            if ($("main").length > 0) {
              elementsHeight += parseInt($("main").css("margin-top"));
            }
            if ($(".chat-input-container").length > 0) {
              elementsHeight += $(".chat-input-container").outerHeight(true);
            }
            if ($(".chat-heading-container").length > 0) {
              elementsHeight += $(".chat-heading-container").outerHeight(true);
            }
            if ($(".separator").length > 0) {
              elementsHeight += $(".separator").outerHeight(true);
            }
            $(".chat-app .scroll").css("height", (window.innerHeight - elementsHeight) + "px");

            if (chatAppScroll) {
              $(".chat-app .scroll").scrollTop(
                $(".chat-app .scroll").prop("scrollHeight")
              );
              chatAppScroll.update();
            }
            if (window.innerWidth < 576) {
              if (chatAppScroll) {
                chatAppScroll.destroy();
                chatAppScroll = null;
              }
              $(".chat-app .scroll-content > div:last-of-type").css("padding-bottom", ($(".chat-input-container").outerHeight(true)) + "px");

              if (!initialized) {
                setTimeout(function () {
                  $("html, body").animate({ scrollTop: $(document).height() + 30 }, 100);
                }, 300);
                initialized = true;
              }
            } else {
              if (!chatAppScroll) {
                createChatAppScroll();
              }
              $(".chat-app .scroll-content > div:last-of-type").css("padding-bottom", 0);
            }
          }
          $(window).on("resize", function (event) {
            calculateHeight();
          });
          calculateHeight();

          return;
        }
        var ps = new PerfectScrollbar($(this)[0], { suppressScrollX: true });
        ps.isRtl = false;
      });
    }

    /* 03.25. Progress */
    $(".progress-bar").each(function () {
      $(this).css("width", $(this).attr("aria-valuenow") + "%");
    });

    if (typeof ProgressBar !== "undefined") {
      $(".progress-bar-circle").each(function () {
        var val = $(this).attr("aria-valuenow");
        var color = $(this).data("color") || themeColor1;
        var trailColor = $(this).data("trailColor") || "#d7d7d7";
        var max = $(this).attr("aria-valuemax") || 100;
        var showPercent = $(this).data("showPercent");
        var circle = new ProgressBar.Circle(this, {
          color: color,
          duration: 20,
          easing: "easeInOut",
          strokeWidth: 4,
          trailColor: trailColor,
          trailWidth: 4,
          text: {
            autoStyleContainer: false
          },
          step: function (state, bar) {
            if (showPercent) {
              bar.setText(Math.round(bar.value() * 100) + "%");
            } else {
              bar.setText(val + "/" + max);
            }
          }
        }).animate(val / max);
      });
    }

    

    /* 03.29. State Button */
    var $successButton = $("#successButton").stateButton();
    $successButton.on("click", function (event) {
      event.preventDefault();
      $successButton.showSpinner();
      //Demonstration states with a timeout
      setTimeout(function () {
        $successButton.showSuccess(true);
        setTimeout(function () {
          $successButton.reset();
        }, 2000);
      }, 3000);
    });

    var $failButton = $("#failButton").stateButton();
    $("#failButton").on("click", function (event) {
      event.preventDefault();
      $failButton.showSpinner();
      //Demonstration states with a timeout
      setTimeout(function () {
        $failButton.showFail(true);
        setTimeout(function () {
          $failButton.reset();
        }, 2000);
      }, 3000);
    });

    /* 03.30. Typeahead */
    var testData = [
      {
        name: "May",
        index: 0,
        id: "5a8a9bfd8bf389ba8d6bb211"
      },
      {
        name: "Fuentes",
        index: 1,
        id: "5a8a9bfdee10e107f28578d4"
      },
      {
        name: "Henderson",
        index: 2,
        id: "5a8a9bfd4f9e224dfa0110f3"
      },
      {
        name: "Hinton",
        index: 3,
        id: "5a8a9bfde42b28e85df34630"
      },
      {
        name: "Barrera",
        index: 4,
        id: "5a8a9bfdc0cba3abc4532d8d"
      },
      {
        name: "Therese",
        index: 5,
        id: "5a8a9bfdedfcd1aa0f4c414e"
      },
      {
        name: "Nona",
        index: 6,
        id: "5a8a9bfdd6686aa51b953c4e"
      },
      {
        name: "Frye",
        index: 7,
        id: "5a8a9bfd352e2fd4c101507d"
      },
      {
        name: "Cora",
        index: 8,
        id: "5a8a9bfdb5133142047f2600"
      },
      {
        name: "Miles",
        index: 9,
        id: "5a8a9bfdadb1afd136117928"
      },
      {
        name: "Cantrell",
        index: 10,
        id: "5a8a9bfdca4795bcbb002057"
      },
      {
        name: "Benson",
        index: 11,
        id: "5a8a9bfdaa51e9a4aeeddb7d"
      },
      {
        name: "Susanna",
        index: 12,
        id: "5a8a9bfd57dd857535ef5998"
      },
      {
        name: "Beatrice",
        index: 13,
        id: "5a8a9bfd68b6f12828da4175"
      },
      {
        name: "Tameka",
        index: 14,
        id: "5a8a9bfd2bc4a368244d5253"
      },
      {
        name: "Lowe",
        index: 15,
        id: "5a8a9bfd9004fda447204d30"
      },
      {
        name: "Roth",
        index: 16,
        id: "5a8a9bfdb4616dbc06af6172"
      },
      {
        name: "Conley",
        index: 17,
        id: "5a8a9bfdfae43320dd8f9c5a"
      },
      {
        name: "Nelda",
        index: 18,
        id: "5a8a9bfd534d9e0ba2d7c9a7"
      },
      {
        name: "Angie",
        index: 19,
        id: "5a8a9bfd57de84496dc42259"
      }
    ];

    if ($().typeahead) {
      $("#query").typeahead({ source: testData });
    }

    /* 03.31. Full Screen */

    function isFullScreen() {
      var isInFullScreen =
        (document.fullscreenElement && document.fullscreenElement !== null) ||
        (document.webkitFullscreenElement &&
          document.webkitFullscreenElement !== null) ||
        (document.mozFullScreenElement &&
          document.mozFullScreenElement !== null) ||
        (document.msFullscreenElement && document.msFullscreenElement !== null);
      return isInFullScreen;
    }

    function fullscreen() {
      var isInFullScreen = isFullScreen();

      var docElm = document.documentElement;
      if (!isInFullScreen) {
        if (docElm.requestFullscreen) {
          docElm.requestFullscreen();
        } else if (docElm.mozRequestFullScreen) {
          docElm.mozRequestFullScreen();
        } else if (docElm.webkitRequestFullScreen) {
          docElm.webkitRequestFullScreen();
        } else if (docElm.msRequestFullscreen) {
          docElm.msRequestFullscreen();
        }
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
          document.webkitExitFullscreen();
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen();
        }
      }
    }

    $("#fullScreenButton").on("click", function (event) {
      event.preventDefault();
      if (isFullScreen()) {
        $($(this).find("i")[1]).css("display", "none");
        $($(this).find("i")[0]).css("display", "inline");
      } else {
        $($(this).find("i")[1]).css("display", "inline");
        $($(this).find("i")[0]).css("display", "none");
      }
      fullscreen();
    });

    /* 03.32. Html Editors */
    if (typeof Quill !== "undefined") {
      var quillToolbarOptions = [
        ["bold", "italic", "underline", "strike"],
        ["blockquote", "code-block"],

        [{ header: 1 }, { header: 2 }],
        [{ list: "ordered" }, { list: "bullet" }],
        [{ script: "sub" }, { script: "super" }],
        [{ indent: "-1" }, { indent: "+1" }],
        [{ direction: direction }],

        [{ size: ["small", false, "large", "huge"] }],
        [{ header: [1, 2, 3, 4, 5, 6, false] }],

        [{ color: [] }, { background: [] }],
        [{ font: [] }],
        [{ align: [] }],

        ["clean"]
      ];

      var quillBubbleToolbarOptions = [
        ["bold", "italic", "underline", "strike"],
        [{ list: "ordered" }, { list: "bullet" }],
        [{ size: ["small", false, "large", "huge"] }],
        [{ color: [] }],
        [{ direction: direction }],
        [{ align: [] }]
      ];

      var editor = new Quill("#quillEditor", {
        modules: { toolbar: quillToolbarOptions },
        theme: "snow"
      });

      var editorBubble = new Quill("#quillEditorBubble", {
        modules: { toolbar: quillBubbleToolbarOptions },
        theme: "bubble"
      });
    }

    if (typeof ClassicEditor !== "undefined") {
      ClassicEditor.create(document.querySelector("#ckEditorClassic")).catch(function (error) { });
    }

    /* 03.33. Showing Body */
    $("body > *").css({ opacity: 0 });

    setTimeout(function () {
      $("body").removeClass("show-spinner");
      $("main").addClass("default-transition");
      $(".sub-menu").addClass("default-transition");
      $(".main-menu").addClass("default-transition");
      $(".theme-colors").addClass("default-transition");
      $("body > *").animate({ opacity: 1 }, 100);
    }, 300);
  }

  init();


$.fn.dore = function (options) {
  return this.each(function () {
    if (undefined == $(this).data("dore")) {
      var plugin = new $.dore(this, options);
      $(this).data("dore", plugin);
    }
  });
};
 

// Get all the keys from document
var keys = document.querySelectorAll('#calculator span');
var operators = ['+', '-', 'x', '÷'];
var decimalAdded = false;

// Add onclick event to all the keys and perform operations
for(var i = 0; i < keys.length; i++) {
	keys[i].onclick = function(e) {
		// Get the input and button values
		var input = document.querySelector('.screen');
		var inputVal = input.innerHTML;
		var btnVal = this.innerHTML;
		
		// Now, just append the key values (btnValue) to the input string and finally use javascript's eval function to get the result
		// If clear key is pressed, erase everything
		if(btnVal == 'C') {
			input.innerHTML = '';
			decimalAdded = false;
		}
		
		// If eval key is pressed, calculate and display the result
		else if(btnVal == '=') {
			var equation = inputVal;
			var lastChar = equation[equation.length - 1];
			
			// Replace all instances of x and ÷ with * and / respectively. This can be done easily using regex and the 'g' tag which will replace all instances of the matched character/substring
			equation = equation.replace(/x/g, '*').replace(/÷/g, '/');
			
			// Final thing left to do is checking the last character of the equation. If it's an operator or a decimal, remove it
			if(operators.indexOf(lastChar) > -1 || lastChar == '.')
				equation = equation.replace(/.$/, '');
			
			if(equation)
				input.innerHTML = eval(equation);
				
			decimalAdded = false;
		}
		
		// Basic functionality of the calculator is complete. But there are some problems like 
		// 1. No two operators should be added consecutively.
		// 2. The equation shouldn't start from an operator except minus
		// 3. not more than 1 decimal should be there in a number
		
		// We'll fix these issues using some simple checks
		
		// indexOf works only in IE9+
		else if(operators.indexOf(btnVal) > -1) {
			// Operator is clicked
			// Get the last character from the equation
			var lastChar = inputVal[inputVal.length - 1];
			
			// Only add operator if input is not empty and there is no operator at the last
			if(inputVal != '' && operators.indexOf(lastChar) == -1) 
				input.innerHTML += btnVal;
			
			// Allow minus if the string is empty
			else if(inputVal == '' && btnVal == '-') 
				input.innerHTML += btnVal;
			
			// Replace the last operator (if exists) with the newly pressed operator
			if(operators.indexOf(lastChar) > -1 && inputVal.length > 1) {
				// Here, '.' matches any character while $ denotes the end of string, so anything (will be an operator in this case) at the end of string will get replaced by new operator
				input.innerHTML = inputVal.replace(/.$/, btnVal);
			}
			
			decimalAdded =false;
		}
		
		// Now only the decimal problem is left. We can solve it easily using a flag 'decimalAdded' which we'll set once the decimal is added and prevent more decimals to be added once it's set. It will be reset when an operator, eval or clear key is pressed.
		else if(btnVal == '.') {
			if(!decimalAdded) {
				input.innerHTML += btnVal;
				decimalAdded = true;
			}
		}
		
		// if any other key is pressed, just append it
		else {
			input.innerHTML += btnVal;
		}
		
		// prevent page jumps
		e.preventDefault();
	} 
}
}