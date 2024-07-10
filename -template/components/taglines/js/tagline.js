const taglinesparent = document.querySelector("#taglines");
for (let tagline of Configuration.General.Taglines) {
  taglinesparent.innerHTML += `<p class="tagline hidden">${tagline}</p>`;
}
const taglinespeed = 2000;
let animatetaglines = true;

//Initial taglines cycle
cycleTagLines(-1);

// Taglines Cycler function
function cycleTagLines(index) {
  const taglines = document.getElementsByClassName("tagline");
  if (Configuration.General.TaglineSpeed > 0) {
    if (index > taglines.length - 1) {
      index = -1;
    }
    if (taglines[index] instanceof HTMLElement) {
      if (taglines[index + 1]) {
        taglines[index].classList.add("hidden");
      }
    }
    if (taglines[index + 1] instanceof HTMLElement) {
      taglines[index + 1].classList.remove("hidden");
    }
    if (index == -1 && taglines[taglines.length - 1]) {
      taglines[taglines.length - 1].classList.add("hidden");
    }
  }
  setTimeout(() => {
    cycleTagLines(index + 1);
  }, Configuration.General.TaglineSpeed);
}
