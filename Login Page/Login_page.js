var NameDiv = document.getElementById("Name-input");
var ConfPwddiv = document.getElementById("Conf-pwd-input");

function Hide() {
  var Su = document.getElementById("lg");
  var subheader = document.getElementById("Subheader");
  var RememberForget = document.getElementById("remember_Forgot");
  var signin = document.getElementById("sign-in");
  var HaveAccount = document.getElementById("footer");

  if (NameDiv.classList.contains("Hidden")) {
    //* Sign up form.

    NameDiv.classList.remove("Hidden");
    NameDiv.classList.add("Visible");
    ConfPwddiv.classList.remove("Hidden");
    ConfPwddiv.classList.add("Visible");
    RememberForget.classList.add("Hidden");
    RememberForget.classList.remove("Visible");
    Su.innerHTML = "Sign up";
    subheader.innerHTML =
      "Hello, Freind! Register with your personnel details.";
    signin.value = "Sign up";
    signin.style = "margin-top:10px";
    HaveAccount.innerHTML =
      'Already have an account? <a style="color: #ff6f61" onclick="Hide()">Login</a>';
  } else {
    //* Sign in form.

    NameDiv.classList.add("Hidden");
    NameDiv.classList.remove("Visible");
    ConfPwddiv.classList.add("Hidden");
    ConfPwddiv.classList.remove("Visible");
    RememberForget.classList.remove("Hidden");
    RememberForget.classList.add("Visible");
    Su.innerHTML = "Login";
    subheader.innerHTML = "Welcome back! Please login to your account.";
    signin.value = "Login";
    signin.style = "margin-top:30px";

    HaveAccount.innerHTML =
      'Don\'t have an account ? <a style="color: #ff6f61" onclick="Hide()">Sign up</a>';
  }
}
