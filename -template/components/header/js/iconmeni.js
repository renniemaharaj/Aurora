// 3) Initialize header menu
document.querySelector(".icon-menu").onclick = () => {
  if (document.body.scrollTop == 0) {
    if (
      document.querySelector("#category").classList.contains("categoryextend")
    ) {
      document.querySelector("#category").classList.remove("categoryextend");
      return;
    }
  }
  document.querySelector("#category").classList.add("categoryextend");
  window.scrollTo({
    top: 0,
    behavior: "smooth", // Optional: smooth scrolling
  });
};
