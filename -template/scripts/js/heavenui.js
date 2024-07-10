const HeavenUI = {
  Tools: {
    filterTest: (filtering, filter) => {
      let passed = true;
      for (char in filtering) {
        if (!filter.includes(filtering[char].toLowerCase())) {
          passed = false;
        }
      }
      return passed;
    },
    returnChildren: (element, except) => {
      const children = element.children;
      const actualchildren = [];
      for (c in children) {
        const child = children[c];
        if (!child.classList) {
          continue;
        }
        if (except && except.includes(child)) {
          continue;
        }
        actualchildren.push(child);
      }
      return actualchildren;
    },
  },
  Effects: {
    DimCover: (element) => {
      const blackout_div = document.createElement("div");
      element.appendChild(blackout_div);
      const animation_delay = 300;
      blackout_div.className = `heavenui_transition_fast heavenui_cover_dom 
            heavenui_transition_cool heavenui_disappear heavenui_visible_invisible heavenui_body_color`;
      function coverDom() {
        blackout_div.classList.add("heavenui_cover_dom");
        blackout_div.classList.remove("heavenui_dissapear");
        setTimeout(() => {
          blackout_div.classList.add("heavenui_visible_slighty");
        }, animation_delay);
      }
      function unCoverDom() {
        blackout_div.classList.remove("heavenui_visible_slighty");
        setTimeout(() => {
          blackout_div.classList.add("heavenui_dissapear");
          blackout_div.classList.remove("heavenui_cover_dom");
        }, animation_delay);
      }
      function discardCover() {
        blackout_div.remove();
      }
      return {
        coverDom: coverDom,
        unCoverDom: unCoverDom,
        getElement: blackout_div,
        discardCover: discardCover,
      };
    },
    DomDimCover: (instance) => {
      return instance.Effects.DimCover(document.body);
    },
    ShakeElement: (element) => {
      const animation_delay = 500;
      element.classList.add("heavenui_shake");
      setTimeout(() => {
        element.classList.remove("heavenui_shake");
      }, animation_delay);
    },
    adjustMaxSize: (element, width, height) => {
      element.style.maxWidth = width;
      element.style.maxHeight = height;
    },
    makeVisible: (element) => {
      element.classList.add("heavenui_visible_fully");
    },
    makeDisappear: (element) => {
      element.classList.remove("heavenui_disappear");
    },
    makeAppear: (element) => {},
    destroyElement: (element) => {
      const animation_delay = 300;
      element.classList.add("heavenui_visible_invisible");
      setTimeout(() => {
        element.remove();
      }, animation_delay);
    },
  },
  Elements: {
    DomStatusBar: (instance) => {
      const contain_status = document.createElement("div");
      contain_status.className =
        "heavenui_dom_statusbar heavenui_visible_invisible heavenui_transition_fast";
      document.body.appendChild(contain_status);
      const status_text = document.createElement("span");
      status_text.className = "heavenui_dom_statusbar_text";
      contain_status.appendChild(status_text);
      function beginProgress(_status_text) {
        instance.Effects.makeVisible(contain_status);
        progressStatus(_status_text);
      }
      function progressStatus(_status_text) {
        status_text.innerHTML = _status_text;
      }
      function endProgress() {
        instance.Effects.destroyElement(contain_status);
      }
      return {
        beginProgress: beginProgress,
        progressStatus,
        progressStatus,
        endProgress: endProgress,
      };
    },
    ApplyControls: (element) => {
      const top_handle = document.createElement("div");
      top_handle.className = "heavenui_top_handle";
      element.insertBefore(top_handle, element.firstChild);
      const real_estate = document.createElement("div");
      real_estate.className = "heavenui_tophandle_real_estate";
      top_handle.appendChild(real_estate);
      const handle_header = document.createElement("label");
      handle_header.className = "heavenui_tophandle_header";
      real_estate.appendChild(handle_header);
      const controls = document.createElement("div");
      controls.className = "heavenui_tophandle_controls";
      top_handle.appendChild(controls);
      function applyClose(script) {
        // return new Promise((resolve, reject) => {
        const close_icon = document.createElement("span");
        close_icon.className = "heavenui_tophandle_icon";
        close_icon.innerHTML = `<ion-icon class="heavenui_tophandle_icon_interact" name="close-outline"></ion-icon>`;
        controls.appendChild(close_icon);
        close_icon.onclick = () => {
          script();
        };
      }
      function applyHeader(header) {
        handle_header.innerText = header;
      }
      return { applyClose: applyClose, applyHeader: applyHeader };
    },
    BaseTile: () => {
      const tile = document.createElement("div");
      tile.className = `heavenui_transition_cool heavenui_base_tile heavenui_transition_fast heavenui_base_color 
            heavenui_minimum_size_small_rect heavenui_visible_invisible heavenui_scroll_invisible`;
      return tile;
    },
    AnimatedOptions: (instance, options_parent, disabled) => {
      const contain_options_parent = instance.Elements.BaseTile();
      contain_options_parent.className = "heavenui_contain_options_parent";
      options_parent.classList.add("heavenui_contain_options");
      contain_options_parent.appendChild(options_parent);

      const left_arrow = instance.Elements.BackArrow();
      const right_arrow = instance.Elements.ForwardArrow();

      //This is logic for buttons
      left_arrow.onclick = () => {
        optionsSlide(options_parent._tracker - 1);
      };
      right_arrow.onclick = () => {
        optionsSlide(options_parent._tracker + 1);
      };

      // Ignore insert if disabled
      if (!disabled) {
        // Insert the left arrow as the first child of options_parent
        options_parent.insertBefore(left_arrow, options_parent.firstChild);
        // Append the right arrow as the last child of options_parent
        options_parent.appendChild(right_arrow);
      }

      function optionsSlide(place) {
        if (options_parent) {
          const children = instance.Tools.returnChildren(options_parent, [
            left_arrow,
            right_arrow,
          ]);
          for (c in children) {
            const child = children[c];
            child.classList.add("heavenui_transition_bounce");
            if (c == place) {
              // child.classList.remove("heavenui_options_unfocus");
              child.classList.remove("skeleton-image");
              if (child.onSelected) {
                child.onSelected();
              }
              options_parent._tracker = place;
              continue;
            }
            if (!disabled) {
              // child.classList.add("heavenui_options_unfocus");
              child.classList.add("skeleton-image");
            }
          }
        }
      }
      return contain_options_parent;
    },
    FocussedDomTile: (instance) => {
      const animation_delay = 100;
      const base_tile = instance.Elements.BaseTile();
      document.body.appendChild(base_tile);
      const DomDimCover = instance.Effects.DomDimCover(instance);
      DomDimCover.coverDom();
      base_tile.classList.add("heavenui_focussed_center_tile");
      setTimeout(() => {
        base_tile.classList.add("heavenui_visible_fully");
      }, animation_delay);
      function getElement() {
        return base_tile;
      }
      function removeTile() {
        DomDimCover.unCoverDom();
        base_tile.remove();
        setTimeout(() => {
          DomDimCover.discardCover();
        }, animation_delay);
      }
      return { getTile: getElement, removeTile: removeTile };
    },
    Form: (instance) => {
      const form = document.createElement("form");
      form.className = "heavenui_form";
      function insertRequired(type, placeholder) {
        if (type == "text") {
          const textbox = instance.Elements.InputKeys(instance, placeholder);
          textbox.required = true;
          form.appendChild(textbox);
          return textbox;
        }
        if (type == "letters") {
          const textbox = instance.Elements.InputLetters(instance, placeholder);
          textbox.required = true;
          form.appendChild(textbox);
          return textbox;
        }
        if (type == "numbers") {
          const textbox = instance.Elements.InputNumbers(instance, placeholder);
          textbox.required = true;
          form.appendChild(textbox);
          return textbox;
        }
      }
      function insertOptional(type) {}
      function insertHeader(header) {
        const header_text = document.createElement("p");
        header_text.className = "adminpanel-title";
        header_text.innerText = header;
        form.appendChild(header_text);
      }
      function displayInformation(subject, value) {
        let contain_info = document.createElement("div");
        contain_info.className = "adminpanel-contain-info";
        form.appendChild(contain_info);

        let subject_text = document.createElement("label");
        subject_text.className = "adminpanel-info-subject";
        contain_info.appendChild(subject_text);
        subject_text.innerHTML = subject;

        let value_text = document.createElement("label");
        value_text.className = "adminpanel-info-value";
        contain_info.appendChild(value_text);
        value_text.innerHTML = value;
      }
      return {
        getForm: () => {
          return form;
        },
        insertRequired: insertRequired,
        insertOptional: insertOptional,
        formSubmit: form.onsubmit,
        displayInformation: displayInformation,
        insertHeader: insertHeader,
      };
    },
    BackArrow: () => {
      const contain_inner = document.createElement("button");
      contain_inner.className = "heavenui_arrow heavenui_arrow_back themetext";
      contain_inner.innerHTML = `<ion-icon name="chevron-back-outline"></ion-icon>`;
      return contain_inner;
    },
    ForwardArrow: () => {
      const contain_inner = document.createElement("button");
      contain_inner.className =
        "heavenui_arrow heavenui_arrow_forward themetext";
      contain_inner.innerHTML = `<ion-icon name="chevron-forward-outline"></ion-icon>`;
      return contain_inner;
    },
    FlatButton: (textcontent) => {
      const button = document.createElement("button");
      button.className = "heavenui_button_flat";
      button.textContent = textcontent;
      return button;
    },
    FancyButton: (textcontent) => {
      const button = document.createElement("button");
      button.className = "heavenui_button_flat heavenui_button_fancy";
      button.textContent = textcontent;
      return button;
    },
    TextBox: (placeholder) => {
      const textbox = document.createElement("input");
      textbox.className = "heavenui_textbox";
      textbox.type = "text";
      if (placeholder) {
        textbox.placeholder = placeholder;
      } else {
        textbox.placeholder = "Input Keys";
      }
      return textbox;
    },
    InputKeys: (instance, placeholder) => {
      return instance.Elements.TextBox(placeholder);
    },
    InputLetters: (instance, placeholder) => {
      const textbox = instance.Elements.TextBox(placeholder);
      const letters = "abcdefghijklmnopqrstuvwxyz";
      textbox.onkeydown = (event) => {
        const textbox_values = textbox.value;
        const modifier_keys = ["Backspace", "Enter", "CTRL", "Space", "Shift"];
        if (!modifier_keys.includes(event.key)) {
          if (
            !instance.Tools.filterTest(
              (textbox_values + event.key).split(""),
              letters
            )
          ) {
            event.preventDefault();
            instance.Effects.ShakeElement(textbox);
          }
        }
      };
      return textbox;
    },
    InputNumbers: (instance, placeholder) => {
      const textbox = instance.Elements.TextBox(placeholder);
      const letters = "0123456789";
      textbox.onkeydown = (event) => {
        const textbox_values = textbox.value;
        const modifier_keys = ["Backspace", "Enter", "CTRL", "Space", "Shift"];
        if (!modifier_keys.includes(event.key)) {
          if (
            !instance.Tools.filterTest(
              (textbox_values + event.key).split(""),
              letters
            )
          ) {
            event.preventDefault();
            instance.Effects.ShakeElement(textbox);
          }
        }
      };
      return textbox;
    },
    TimeoutBar: (timeout) => {
      const timeout_bar = document.createElement("div");
      timeout_bar.className = "heavenui_timeout_bar";
      timeout_bar.style.transition = `${timeout}ms linear`;
      setTimeout(() => {
        timeout_bar.style.width = "0px";
      }, 100);
      return timeout_bar;
    },
  },
};
