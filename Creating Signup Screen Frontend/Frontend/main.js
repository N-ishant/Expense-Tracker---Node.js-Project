const myForm = document.getElementById("my-form");
const nameInput = document.getElementById("username");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");

myForm.addEventListener("submit", onSubmit);

async function onSubmit(e) {
  e.preventDefault();

  try {
    const username = nameInput.value;
    const email = emailInput.value;
    const password = passwordInput.value;

    const user = {
      username,
      email,
      password,
    };

    //Sending a POST Request to CRUD API
    const result = await axios.post("http://localhost:8000/user/signup", user);
    console.log(result);

    nameInput.value = "";
    emailInput.value = "";
    passwordInput.value = "";
  } catch (error) {
    document.body.innerHTML += "<h4>Something went wrong</h4>";
    console.log(error);
  }
}