var div1 = document.getElementById("div1");
var div2 = document.getElementById("div2");

function Hide() {
  if (div2.classList.contains("Hidden")) {
    div1.classList.remove("Visible");
    div1.classList.add("Hidden");
    div2.classList.add("Visible");
    div2.classList.remove("Hidden");
  } else {
    div2.classList.remove("Visible");
    div2.classList.add("Hidden");
    div1.classList.add("Visible");
    div1.classList.remove("Hidden");
  }
}
