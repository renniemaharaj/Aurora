//This is the controller, it allows the user to configure the website.
//Parts of the controller is hidden, but all configuring scripts require the controller to be validated

//Initialize Control Panel
initializeController();

//Bind controller button
document.querySelector("#controller-button").onclick = () => {
  if (document.getElementsByClassName("controller-hidden").length > 0) {
    buyNewController();
  } else {
    hideController();
  }
};

//Function to get uploaded media list
function mediaList() {
  return new Promise((resolve, reject) => {
    sendAwait(
      "scripts/-list-media.php",
      `passcode=${SHA256(controller.querySelector("#controllerCode").value)}`
    ).then((list) => {
      try {
        resolve(JSON.parse(list));
      } catch (e) {
        console.log("Media-Listing: Could not list media.");
      }
    });
  });
}

//This function will display a list for the user to select specified amount
function selectList(list, amount, prechecks) {
  let selected_am = 0;
  const selected_array = Array();
  const select_list = document.createElement("div");
  list.forEach((filename) => {
    const contain_check = document.createElement("div");
    contain_check.innerHTML = `<input class="option" type="checkbox">${filename}`;
    selected_array.push(contain_check);
    contain_check.querySelector(".option").value = filename;
    contain_check.querySelector(".option").onclick = (event) => {
      event.preventDefault();
      setTimeout(() => {
        if (event.target.checked) {
          event.target.checked = false;
          selected_am--;
        } else {
          if (amount > 0 && selected_am == amount) {
            return;
          }
          event.target.checked = true;
          selected_am++;
        }
      }, 100);
    };
    select_list.appendChild(contain_check);
    if (prechecks.includes(filename)) {
      select_list.insertBefore(contain_check, select_list.firstChild);
      contain_check.querySelector(".option").checked = true;
      selected_am++;
    }
  });
  //This function will return a list of the selected options
  function selectedList() {
    const selected_list = Array();
    select_list.querySelectorAll(".option").forEach((option) => {
      if (option.checked) {
        selected_list.push(option.value);
      }
    });
    return selected_list;
  }
  return { listElement: select_list, selectedList: selectedList };
}

//This function will show the controller
function buyNewController() {
  document.querySelector("#controller").classList.remove("controller-hidden");
}

//This function will hide controller
function hideController() {
  document.querySelector("#controller").classList.add("controller-hidden");
}

// 0) Insert founder information and platforms
applyConfiguration();

function applyConfiguration() {
  document.querySelector("#sect-catalogue").innerText =
    Configuration.General.SectionCatalogueWriting;
  document.querySelector("#sect-platforms").innerText =
    Configuration.General.SectionPlatformsWriting;
  document.querySelector("#sect-reviews").innerText =
    Configuration.General.SectionReviewsWriting;
  document.querySelector("#footer-avatar").src =
    "media/" + Configuration.Founder.Avatar;
  document.querySelector("#footer-name").innerText =
    Configuration.Founder.FirstName + " " + Configuration.Founder.LastName;
  document.querySelector("#footer-biography").innerText =
    Configuration.Founder.Biography;

  if (Configuration.Founder.Platforms.Facebook) {
    document.querySelector("#contact-facebook").href =
      Configuration.Founder.Platforms.Facebook;
  } else {
    document.querySelector("#contact-facebook").style.display = "none";
  }
  if (Configuration.Founder.Platforms.Instagram) {
    document.querySelector("#contact-instagram").href =
      Configuration.Founder.Platforms.Instagram;
  } else {
    document.querySelector("#contact-instagram").style.display = "none";
  }
  if (Configuration.Founder.Platforms.Twitter) {
    document.querySelector("#contact-twitter").href =
      Configuration.Founder.Platforms.Twitter;
  } else {
    document.querySelector("#contact-twitter").style.display = "none";
  }
  if (Configuration.Founder.Email) {
    document.querySelector("#contact-email").href =
      "mailto:" + Configuration.Founder.Email;
    document.querySelector("#contact-email").innerText =
      "-" + Configuration.Founder.Email;
  } else {
    document.querySelector("#email-parent").style.display = "none";
  }
  document.querySelector("#contact-name").innerText =
    Configuration.Founder.FirstName + " " + Configuration.Founder.LastName;
}

//This function will initialize the controller, adding logic to it's HTML
function initializeController() {
  //Here, we will first reference the controller and then apply HeavenUI controls to it
  const controller = document.querySelector("#controller");
  const controls = HeavenUI.Elements.ApplyControls(controller);
  controls.applyClose(hideController);

  //Section 1) Button clicks and form submitting
  //
  //IE, onclick and onsubmit events
  //

  //Logic for order navigation arrows
  controller
    .querySelector("#following-arrows")
    .querySelector(".left-arrow").onclick = () => {
    controller.querySelector("#controller-orders-list-div").scrollTo({
      left:
        controller.querySelector("#controller-orders-list-div").scrollLeft -
        200,
      behavior: "smooth",
    });
  };
  controller
    .querySelector("#following-arrows")
    .querySelector(".right-arrow").onclick = () => {
    controller.querySelector("#controller-orders-list-div").scrollTo({
      left:
        controller.querySelector("#controller-orders-list-div").scrollLeft +
        200,
      behavior: "smooth",
    });
  };
  //Logic for uploading files
  controller.querySelector("#controller-upload-media").onclick = () => {
    const tUploader = TrueUploader({
      accepted: [],
      size: 1000000000,
      multiple: true,
      boundingelement: controller.querySelector("#controller-media-list"),
      onadded: (files) => {},
      onfail: (e) => {
        console.log(`Uploader: ${e}`);
      },
      onsuccess: (files) => {
        if (tUploader.hasFilesToUpload()) {
          tUploader.uploadStart(
            tUploader.getAcceptedFiles(),
            (status) => {
              controller.querySelector("#upload-status").innerText = status;
            },
            () => {
              controller.querySelector("#upload-status").innerText =
                "Upload done";
              controller.querySelector("#controller-list-media").click();
            }
          );
        }
      },
    });
    tUploader.openFilePicker();
  };
  controller.querySelector("#controller-validate").onsubmit = () => {
    sendAwait(
      "scripts/-validate.php",
      `passcode=${SHA256(controller.querySelector("#controllerCode").value)}`
    ).then((response) => {
      console.log(SHA256(controller.querySelector("#controllerCode").value));
      if (response == "0") {
        controller
          .querySelector("#controller-configuration")
          .classList.remove("hidden");
        controller.querySelector("#create-product").classList.remove("hidden");
        controller
          .querySelector("#controller-products")
          .classList.remove("hidden");
        controller
          .querySelector("#controller-media")
          .classList.remove("hidden");
        controller
          .querySelector("#controller-validate")
          .classList.add("scale0");
      } else {
        console.log(response);
      }
    });
    return false;
  };
  //Form logic for product create submit
  controller.querySelector("#create-product").onsubmit = () => {
    let product = Object();
    const product_form = document.querySelector("#create-product");
    product.title = product_form.querySelector("#title").value;
    product["unit-quantity"] =
      product_form.querySelector("#unit-quantity").value;
    try {
      product["unit-quantity"] = parseInt(product["unit-quantity"]);
    } catch (e) {
      product["unit-quantity"] = 0;
    }
    product.description = product_form.querySelector("#description").value;
    product.charge = product_form.querySelector("#charge").value;
    try {
      product.charge = parseInt(product.charge);
    } catch (e) {
      product.charge = 0;
    }
    product.stock = product_form.querySelector("#stock").value;
    try {
      product.stock = parseInt(product.stock);
    } catch (e) {
      product.stock = 0;
    }
    product.thumbnails = [];
    if (controller.querySelector("#controller-media-list-product").Selects) {
      product.thumbnails = controller
        .querySelector("#controller-media-list-product")
        .Selects();
    }
    product.currency = product_form.querySelector("#currency").value;

    sendAwait(
      "scripts/-+product.php",
      `passcode=${SHA256(
        controller.querySelector("#controllerCode").value
      )}&product=${JSON.stringify(product)}`
    ).then((response) => {
      hideController();
      location = location;
    });
    return false;
  };

  //Event for controller configuration submit
  controller.querySelector("#controller-configuration").onsubmit = (event) => {
    // event.preventDefault();
    if (controller.querySelector("#controller-media-list-avatar").Selects) {
      Configuration.Founder.Avatar = controller
        .querySelector("#controller-media-list-avatar")
        .Selects();
    }

    if (controller.querySelector("#controller-media-list-slideshow").Selects) {
      Configuration.General.SlideShowList = controller
        .querySelector("#controller-media-list-slideshow")
        .Selects();
    }
    sendAwait(
      "scripts/-save-config.php",
      `passcode=${SHA256(
        controller.querySelector("#controllerCode").value
      )}&configuration=${JSON.stringify(Configuration)}`
    ).then((response) => {
      console.log(response);
      hideController();
    });
    return false;
  };

  document.querySelector("#docTitle").value = Configuration.Document.title;
  document.querySelector("#docTitle").onchange = () => {
    Configuration.Document.title = document.querySelector("#docTitle").value;
    document.title = Configuration.Document.title; // Update the document title
  };

  document.querySelector("#docDescription").value =
    Configuration.Document.description;
  document.querySelector("#docDescription").onchange = () => {
    Configuration.Document.description =
      document.querySelector("#docDescription").value;
    updateMetaTag("description", Configuration.Document.description);
  };

  document.querySelector("#docKeywords").value =
    Configuration.Document.keywords.join(", ");
  document.querySelector("#docKeywords").onchange = () => {
    Configuration.Document.keywords = document
      .querySelector("#docKeywords")
      .value.split(", ")
      .map((keyword) => keyword.trim());
    updateMetaTag("keywords", Configuration.Document.keywords.join(", "));
  };

  document.querySelector("#docAuthor").value = Configuration.Document.author;
  document.querySelector("#docAuthor").onchange = () => {
    Configuration.Document.author = document.querySelector("#docAuthor").value;
    updateMetaTag("author", Configuration.Document.author);
  };

  document.querySelector("#docCharset").value = Configuration.Document.charset;
  document.querySelector("#docCharset").onchange = () => {
    Configuration.Document.charset =
      document.querySelector("#docCharset").value;
    document
      .querySelector("meta[charset]")
      .setAttribute("charset", Configuration.Document.charset);
  };

  document.querySelector("#docViewport").value =
    Configuration.Document.viewport;
  document.querySelector("#docViewport").onchange = () => {
    Configuration.Document.viewport =
      document.querySelector("#docViewport").value;
    updateMetaTag("viewport", Configuration.Document.viewport);
  };

  document.querySelector("#docCanonical").value =
    Configuration.Document.canonical;
  document.querySelector("#docCanonical").onchange = () => {
    Configuration.Document.canonical =
      document.querySelector("#docCanonical").value;
    updateLinkTag("canonical", Configuration.Document.canonical);
  };

  document.querySelector("#docLanguage").value =
    Configuration.Document.language;
  document.querySelector("#docLanguage").onchange = () => {
    Configuration.Document.language =
      document.querySelector("#docLanguage").value;
    document.documentElement.lang = Configuration.Document.language;
  };

  document.querySelector("#docFavicon").value = Configuration.Document.favicon;
  document.querySelector("#docFavicon").onchange = () => {
    Configuration.Document.favicon =
      document.querySelector("#docFavicon").value;
    updateLinkTag("icon", Configuration.Document.favicon);
  };

  document.querySelector("#docThemeColor").value =
    Configuration.Document.theme_color;
  document.querySelector("#docThemeColor").onchange = () => {
    Configuration.Document.theme_color =
      document.querySelector("#docThemeColor").value;
    updateMetaTag("theme-color", Configuration.Document.theme_color);
  };

  document.querySelector("#docRobots").value = Configuration.Document.robots;
  document.querySelector("#docRobots").onchange = () => {
    Configuration.Document.robots = document.querySelector("#docRobots").value;
    updateMetaTag("robots", Configuration.Document.robots);
  };

  // Update Open Graph meta tags
  document.querySelector("#ogEnabled").checked =
    Configuration.Document.open_graph.enabled;
  document.querySelector("#ogEnabled").onchange = () => {
    Configuration.Document.open_graph.enabled =
      document.querySelector("#ogEnabled").checked;
    toggleOpenGraphMetaTags(Configuration.Document.open_graph.enabled);
  };

  document.querySelector("#ogTitle").value =
    Configuration.Document.open_graph.og_title;
  document.querySelector("#ogTitle").onchange = () => {
    Configuration.Document.open_graph.og_title =
      document.querySelector("#ogTitle").value;
    updateMetaTag("og:title", Configuration.Document.open_graph.og_title);
  };

  document.querySelector("#ogType").value =
    Configuration.Document.open_graph.og_type;
  document.querySelector("#ogType").onchange = () => {
    Configuration.Document.open_graph.og_type =
      document.querySelector("#ogType").value;
    updateMetaTag("og:type", Configuration.Document.open_graph.og_type);
  };

  document.querySelector("#ogImage").value =
    Configuration.Document.open_graph.og_image;
  document.querySelector("#ogImage").onchange = () => {
    Configuration.Document.open_graph.og_image =
      document.querySelector("#ogImage").value;
    updateMetaTag("og:image", Configuration.Document.open_graph.og_image);
  };

  document.querySelector("#ogUrl").value =
    Configuration.Document.open_graph.og_url;
  document.querySelector("#ogUrl").onchange = () => {
    Configuration.Document.open_graph.og_url =
      document.querySelector("#ogUrl").value;
    updateMetaTag("og:url", Configuration.Document.open_graph.og_url);
  };

  document.querySelector("#ogDescription").value =
    Configuration.Document.open_graph.og_description;
  document.querySelector("#ogDescription").onchange = () => {
    Configuration.Document.open_graph.og_description =
      document.querySelector("#ogDescription").value;
    updateMetaTag(
      "og:description",
      Configuration.Document.open_graph.og_description
    );
  };

  // Update Twitter Card meta tags
  document.querySelector("#twitterEnabled").checked =
    Configuration.Document.twitter_card.enabled;
  document.querySelector("#twitterEnabled").onchange = () => {
    Configuration.Document.twitter_card.enabled =
      document.querySelector("#twitterEnabled").checked;
    toggleTwitterCardMetaTags(Configuration.Document.twitter_card.enabled);
  };

  document.querySelector("#twitterCard").value =
    Configuration.Document.twitter_card.twitter_card;
  document.querySelector("#twitterCard").onchange = () => {
    Configuration.Document.twitter_card.twitter_card =
      document.querySelector("#twitterCard").value;
    updateMetaTag(
      "twitter:card",
      Configuration.Document.twitter_card.twitter_card
    );
  };

  document.querySelector("#twitterSite").value =
    Configuration.Document.twitter_card.twitter_site;
  document.querySelector("#twitterSite").onchange = () => {
    Configuration.Document.twitter_card.twitter_site =
      document.querySelector("#twitterSite").value;
    updateMetaTag(
      "twitter:site",
      Configuration.Document.twitter_card.twitter_site
    );
  };

  document.querySelector("#twitterCreator").value =
    Configuration.Document.twitter_card.twitter_creator;
  document.querySelector("#twitterCreator").onchange = () => {
    Configuration.Document.twitter_card.twitter_creator =
      document.querySelector("#twitterCreator").value;
    updateMetaTag(
      "twitter:creator",
      Configuration.Document.twitter_card.twitter_creator
    );
  };

  document.querySelector("#twitterTitle").value =
    Configuration.Document.twitter_card.twitter_title;
  document.querySelector("#twitterTitle").onchange = () => {
    Configuration.Document.twitter_card.twitter_title =
      document.querySelector("#twitterTitle").value;
    updateMetaTag("twitter:title", Configuration.Document.twitter_title);
  };

  document.querySelector("#twitterDescription").value =
    Configuration.Document.twitter_card.twitter_description;
  document.querySelector("#twitterDescription").onchange = () => {
    Configuration.Document.twitter_card.twitter_description =
      document.querySelector("#twitterDescription").value;
    updateMetaTag(
      "twitter:description",
      Configuration.Document.twitter_description
    );
  };

  document.querySelector("#twitterImage").value =
    Configuration.Document.twitter_card.twitter_image;
  document.querySelector("#twitterImage").onchange = () => {
    Configuration.Document.twitter_card.twitter_image =
      document.querySelector("#twitterImage").value;
    updateMetaTag("twitter:image", Configuration.Document.twitter_image);
  };

  //List media via selector on click for avatar
  controller.querySelector("#controller-avatar-list-media").onclick = () => {
    mediaList().then((list) => {
      let select_list = selectList(list, 1, Configuration.Founder.Avatar);
      controller.querySelector("#controller-media-list-avatar").innerHTML = "";
      controller
        .querySelector("#controller-media-list-avatar")
        .appendChild(select_list.listElement);
      controller.querySelector("#controller-media-list-avatar").Selects =
        select_list.selectedList;
    });
  };

  //List media via selector on click for product creation
  controller.querySelector("#controller-media-list-media-product").onclick =
    () => {
      mediaList().then((list) => {
        let select_list = selectList(list, 0, []);
        controller.querySelector("#controller-media-list-product").innerHTML =
          "";
        controller
          .querySelector("#controller-media-list-product")
          .appendChild(select_list.listElement);
        controller.querySelector("#controller-media-list-product").Selects =
          select_list.selectedList;
      });
    };
  //List media via selector on click for slidehsow
  controller.querySelector("#controller-avatar-list-media-slideshow").onclick =
    () => {
      mediaList().then((list) => {
        let select_list = selectList(
          list,
          0,
          Configuration.General.SlideShowList
        );
        controller.querySelector("#controller-media-list-slideshow").innerHTML =
          "";
        controller
          .querySelector("#controller-media-list-slideshow")
          .appendChild(select_list.listElement);
        controller.querySelector("#controller-media-list-slideshow").Selects =
          select_list.selectedList;
      });
    };

  //List products on form submit
  controller.querySelector("#controller-products-form").onsubmit = () => {
    queryProducts("").then((products) => {
      controller_products = controller.querySelector("#controller-products");
      products.forEach((product) => {
        controller_products.appendChild(buildProduct(product, true));
      });
      controller.querySelector("#controller-products-form").remove();
    });
    return false;
  };

  //List media via media slider on form submit
  controller.querySelector("#controller-media-form").onsubmit = () => {
    mediaList().then((list) => {
      controller.querySelector("#controller-media-list").innerHTML = "";
      const mediaslider = mediaSlider(
        list,
        controller.querySelector("#controller-media-list"),
        !0
      );
    });
    return false;
  };

  //List orders
  controller.querySelector("#controller-orders-form").onsubmit = (event) => {
    event.preventDefault();
    queryOrders("").then((orderlist) => {
      if (orderlist != "E1") {
        displayOrders(orderlist);
      }
    });
  };

  //Loading configuration into controller.
  //Changing controller local settings should be refelcted globally
  //
  //
  document.querySelector("#bgColor").value = Configuration.Colouring.Background;
  document.querySelector("#bgColor").onchange = () => {
    Configuration.Colouring.Background =
      document.querySelector("#bgColor").value;
    applyColouring();
  };

  document.querySelector("#complimentColor").value =
    Configuration.Colouring.Compliment;
  document.querySelector("#complimentColor").onchange = () => {
    Configuration.Colouring.Compliment =
      document.querySelector("#complimentColor").value;
    applyColouring();
  };

  document.querySelector("#accentColor").value = Configuration.Colouring.Accent;
  document.querySelector("#accentColor").onchange = () => {
    Configuration.Colouring.Accent =
      document.querySelector("#accentColor").value;
    applyColouring();
  };

  document.querySelector("#defaultFont").value =
    Configuration.Colouring.DefaultFont;
  document.querySelector("#defaultFont").onchange = () => {
    Configuration.Colouring.DefaultFont =
      document.querySelector("#defaultFont").value;
    applyColouring();
  };

  document.querySelector("#accentFont").value =
    Configuration.Colouring.AccentFont;
  document.querySelector("#accentFont").onchange = () => {
    Configuration.Colouring.AccentFont =
      document.querySelector("#accentFont").value;
  };

  document.querySelector("#founderFName").value =
    Configuration.Founder.FirstName;
  document.querySelector("#founderFName").onchange = () => {
    Configuration.Founder.FirstName =
      document.querySelector("#founderFName").value;
  };

  document.querySelector("#founderLName").value =
    Configuration.Founder.LastName;
  document.querySelector("#founderLName").onchange = () => {
    Configuration.Founder.LastName =
      document.querySelector("#founderLName").value;
  };

  document.querySelector("#founderEmail").value = Configuration.Founder.Email;
  document.querySelector("#founderEmail").onchange = () => {
    Configuration.Founder.Email = document.querySelector("#founderEmail").value;
  };

  document.querySelector("#founderBiography").value =
    Configuration.Founder.Biography;
  document.querySelector("#founderBiography").onchange = () => {
    Configuration.Founder.Biography =
      document.querySelector("#founderBiography").value;
  };

  document.querySelector("#founderFacebook").value =
    Configuration.Founder.Platforms.Facebook;
  document.querySelector("#founderFacebook").onchange = () => {
    Configuration.Founder.Platforms.Facebook =
      document.querySelector("#founderFacebook").value;
  };

  document.querySelector("#founderInstagram").value =
    Configuration.Founder.Platforms.Instagram;
  document.querySelector("#founderInstagram").onchange = () => {
    Configuration.Founder.Platforms.Instagram =
      document.querySelector("#founderInstagram").value;
  };

  document.querySelector("#founderTwitter").value =
    Configuration.Founder.Platforms.Twitter;
  document.querySelector("#founderTwitter").onchange = () => {
    Configuration.Founder.Platforms.Twitter =
      document.querySelector("#founderTwitter").value;
  };

  document.querySelector("#ctrl-taglines").value =
    Configuration.General.Taglines.toString();
  document.querySelector("#ctrl-taglines").onchange = () => {
    Configuration.General.Taglines = document
      .querySelector("#ctrl-taglines")
      .value.split(",");
  };

  document.querySelector("#catalogueText").value =
    Configuration.General.SectionCatalogueWriting;
  document.querySelector("#catalogueText").onchange = () => {
    Configuration.General.SectionCatalogueWriting =
      document.querySelector("#catalogueText").value;
  };

  document.querySelector("#platformsText").value =
    Configuration.General.SectionPlatformsWriting;
  document.querySelector("#platformsText").onchange = () => {
    Configuration.General.SectionPlatformsWriting =
      document.querySelector("#platformsText").value;
  };

  document.querySelector("#reviewsText").value =
    Configuration.General.SectionReviewsWriting;
  document.querySelector("#reviewsText").onchange = () => {
    Configuration.General.SectionReviewsWriting =
      document.querySelector("#reviewsText").value;
  };

  document.querySelector("#animationSpeed").value =
    Configuration.General.AnimationSpeed;
  document.querySelector("#animationSpeed").onchange = () => {
    Configuration.General.AnimationSpeed = parseFloat(
      document.querySelector("#animationSpeed").value
    );
  };

  document.querySelector("#slideShowSpeed").value =
    Configuration.General.SlideShowSpeed;
  document.querySelector("#slideShowSpeed").onchange = () => {
    Configuration.General.SlideShowSpeed = parseInt(
      document.querySelector("#slideShowSpeed").value
    );
  };

  document.querySelector("#taglineSpeed").value =
    Configuration.General.TaglineSpeed;
  document.querySelector("#taglineSpeed").onchange = () => {
    Configuration.General.TaglineSpeed = parseInt(
      document.querySelector("#taglineSpeed").value
    );
  };

  //Add controller version information
  controller.querySelector("#controller-version-info").innerText = `
  Author: Rennie Maharaj
        Version: 1.5
        changelog:
        + Media uploader and all dependencies
        & Much more 
        todo:
        ~ Reviews
        Overall completion: 90%
  `;
}
