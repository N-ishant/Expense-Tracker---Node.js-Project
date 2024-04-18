const myForm = document.getElementById("my-form");
const amountInput = document.getElementById("amount");
const descriptionInput = document.getElementById("description");
const categoryInput = document.getElementById("category");
const list = document.getElementById("list");
const mssg = document.querySelector(".msg");

myForm.addEventListener("submit", onSubmit);

function onSubmit(e) {
  e.preventDefault();

  const amount = amountInput.value;
  const description = descriptionInput.value;
  const category = categoryInput.value;

  const expense = {
    amount,
    description,
    category,
  };

  const token = localStorage.getItem("token");
  axios
    .post("http://localhost:8000/expense/add-expense", expense, {
      headers: { Authorization: token },
    })
    .then((res) => {
      showExpenseOnScreen(res.data.newExpenseData);
      console.log(res);
    })
    .catch((error) => {
      mssg.classList.add("error");
      mssg.textContent = "Something went wrong";
      console.log(error);
    });
  setTimeout(() => {
    mssg.textContent = "";
    mssg.classList.remove("error");
  }, 3000);
}

window.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");
  axios
    .get("http://localhost:8000/expense/get-expenses", {
      headers: { Authorization: token },
    })
    .then((res) => {
      console.log(res);
      for (var i = 0; i < res.data.allExpenses.length; i++) {
        showExpenseOnScreen(res.data.allExpenses[i]);
      }
    })
    .catch((error) => {
      mssg.classList.add("error");
      mssg.textContent = "Internal Server Error. Please try again later.";
      console.log(error);
    });
  setTimeout(() => {
    mssg.textContent = "";
    mssg.classList.remove("error");
  }, 3000);
});

function showExpenseOnScreen(expense) {
  const li = document.createElement("li");
  const details = document.createTextNode(
    `${expense.amount} : ${expense.description} : ${expense.category}`
  );

  // DELETE BUTTON
  const deleteBtn = document.createElement("input");
  deleteBtn.type = "button";
  deleteBtn.value = "Delete Expense";
  deleteBtn.style.color = "white";
  deleteBtn.style.backgroundColor = "Red";

  deleteBtn.onclick = () => {
    const token = localStorage.getItem("token");
    axios
      .delete(`http://localhost:8000/expense/delete-expense/${expense.id}`, {
        headers: { Authorization: token },
      })
      .then((res) => {
        console.log("Expense deleted successfully");
        list.removeChild(li);
      })
      .catch((error) => {
        mssg.classList.add("error");
        // mssg.textContent =
        //   "Oops! Something went wrong. Please try again later.";
        if (
          error.response &&
          error.response.data &&
          error.response.data.message
        ) {
          mssg.textContent = error.response.data.message;
        } else {
          mssg.textContent =
            "Oops! Something went wrong. Please try again later.";
        }
        console.log(error);
      });
    setTimeout(() => {
      mssg.textContent = "";
      mssg.classList.remove("error");
    }, 3000);
  };

  li.appendChild(details);
  li.appendChild(deleteBtn);
  list.appendChild(li);

  // Clear Fields
  amountInput.value = "";
  descriptionInput.value = "";
  categoryInput.value = "";
}