// Array of common image file types
const imagetypes = [
  "jpg",
  "jpeg",
  "png",
  "gif",
  "bmp",
  "tiff",
  "svg",
  "webp",
  "ico",
];

// Array of common video file types
const videotypes = [
  "mp4",
  "avi",
  "mov",
  "wmv",
  "flv",
  "mkv",
  "webm",
  "mpg",
  "mpeg",
  "3gp",
  "m4v",
];
// Function to detect extension from filename
const extensionOf = (filename) => {
  const parts = filename.split(".");
  return parts[parts.length - 1];
};
function getRandomString(
  length,
  charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"
) {
  // Ensure the length is a positive number
  if (length <= 0) {
    throw new Error("Length should be a positive number");
  }

  // Generate random string
  let result = "";
  const charsetLength = charset.length;
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charsetLength);
    result += charset[randomIndex];
  }
  return result;
}
function inhibitInside(parent, s, fixed, ignoreload) {
  let l = document.createElement("div");
  parent.appendChild(l);
  l.className = "loader themeinner";
  fixed ? (l.style.position = "fixed") : (l.style.position = "absolute");

  if (!ignoreload) {
    let bw = document.createElement("div");
    bw.className = "doload";
    l.appendChild(bw);
  }
  return (stopper = () => {
    l.classList.add("removeloader");
    setTimeout(() => {
      l.remove();
    }, 500);
  });
}

function Inhibitor() {
  let i;
  let o = [];
  return [
    function (e) {
      !o.includes(e) || o.push(e);
      if (!i) {
        i = inhibitInside(document.body, true, true);
      }
    },
    function (e) {
      for (u in o) o[u] == e && delete o[u], (o = o.filter((e) => e));
      sizeOf(o) <= 0 && (i(), (i = undefined));
    },
  ];
}
//Function to get media url
function getMedia(owner, filename, type) {
  owner = "media/";
  return new Promise((resolve, reject) => {
    resolve(owner + filename);
  });
}
// Media sliding function
function mediaSlider(list, parent, owner, plain = false, ignoreclick = false) {
  if (list.length == 0) {
    console.log("Mediaslider: Recieved empty list.");
    return;
  }
  const pkey = getRandomString(10);

  const contain_changers = document.createElement("div");
  contain_changers._tracker = 0;

  if (list.length > 0) {
    contain_changers.className = "li themetext";
    parent.appendChild(contain_changers);
  }

  const current_element = { type: undefined, element: undefined };

  function setCurrent(type, element) {
    current_element.type = type;
    current_element.element = element;
  }

  function destroyCurrent() {
    return new Promise((resolve) => {
      if (!current_element.element) {
        resolve();
        return;
      }
      const element = current_element.element;
      if (current_element.type === "video") element.getWrapper().remove();
      if (current_element.type === "img") element.remove();
      resolve();
    });
  }

  function processAppend(type, passed_element) {
    if (current_element.element != undefined && current_element.type == type) {
      function updateVideo(src, title) {
        const video_player = current_element.element.getPlayer();
        video_player.src = src;
        video_player.load();
        video_player.functionPlay();
        current_element.element.setTitle(title);
        reverseFade(passed_element);
      }
      function updateImage(src) {
        current_element.element.src = src;
        const img = document.createElement("img");
        current_element.element.onload = () => {
          current_element.element.classList.remove("blur-transition");
        };
      }
      if (plain) {
        current_element.element.src = list[place];
      }
      if (!plain) {
        getMedia(owner, list[contain_changers._tracker], type).then(
          (response) => {
            if (type == "video") {
              updateVideo(response, list[place]);
            }
            if (type == "img") {
              updateImage(response);
            }
          }
        );
      }
      return;
    }
    destroyCurrent().then(() => {
      if (type === "video") appendVideo();
      if (type === "img") appendImage();
    });
  }

  function appendVideo() {
    const src = list[contain_changers._tracker];
    if (plain) {
      const video_player = getPlayer(
        src,
        parent,
        list[contain_changers._tracker]
      );
      video_player.getWrapper().classList.add(pkey);
      setCurrent("video", video_player);
    } else {
      getMedia(owner, src, "video").then((response) => {
        const video_player = getPlayer(
          response,
          parent,
          list[contain_changers._tracker]
        );
        video_player.getWrapper().classList.add(pkey);
        setCurrent("video", video_player);
      });
    }
  }

  function appendImage() {
    const src = list[contain_changers._tracker];
    const img = document.createElement("img");
    img.id = pkey;
    img.className = `${pkey} slideshowimg`;
    parent.appendChild(img);
    const stop = inhibitInside(parent, true);
    img.onload = () => {
      stop();
      reverseFade(img);
    };
    setCurrent("img", img);
    if (plain) {
      img.src = src;
    } else {
      getMedia(owner, src, "img").then((response) => {
        img.src = response;
      });
    }
  }

  function reverseFade(element) {
    element.classList.remove("imagefadeout");
  }

  function transitionFade() {
    return new Promise((resolve) => {
      if (!document.querySelector(`#${pkey}`)) {
        resolve();
        return;
      }
      const fadeElement = document.querySelector(`#${pkey}`);
      if (!fadeElement) {
        resolve();
        return;
      }
      setTimeout(() => {
        fadeElement.classList.add("blur-transition");
        setTimeout(() => {
          resolve(fadeElement);
        }, 200);
      }, 100);
    });
  }

  const appendBtns = () => {
    list.forEach((item, index) => {
      const rando = Date.now() + getRandomString(10);
      const option = document.createElement("p");
      option.className = "heavenui_media_ball heavenui_options_unfocus";
      option.classList.add(rando);
      option.onclick = (e) => {
        e.stopPropagation();
        contain_changers._tracker = index;
        nextMedia();
      };
      option.onSelected = () => {
        nextMedia();
      };
      if (list.length > 1) {
        contain_changers.appendChild(option);
      }
      option.style.display = "block";
    });

    if (list.length > 1) {
      const contain_slider = HeavenUI.Elements.AnimatedOptions(
        HeavenUI,
        contain_changers
      );
      parent.appendChild(contain_slider);
    }

    function nextMedia() {
      transitionFade().then((response) => {
        const ext = extensionOf(list[contain_changers._tracker]);
        if (list[contain_changers._tracker].startsWith("data:")) {
          if (
            list[contain_changers._tracker].split("data:")[1].includes("image")
          ) {
            processAppend("img", response);
          } else {
            processAppend("video", response);
          }
        } else {
          if (imagetypes.includes(ext)) {
            processAppend("img", response);
          }
          if (videotypes.includes(ext)) {
            processAppend("video", response);
          }
        }
      });
    }
    // setInterval(() => {
    //   // Check if the next place exists in the list
    //   contain_changers._tracker++;
    //   if (contain_changers._tracker > list.length - 1) {
    //     contain_changers._tracker = 0;
    //   }
    //   nextMedia();
    // }, 5000);
    nextMedia();
  };

  appendBtns();
  return parent;
}
