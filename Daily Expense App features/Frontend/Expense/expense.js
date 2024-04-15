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

  axios
    .post("http://localhost:8000/expense/add-expense", expense)
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
  axios
    .get("http://localhost:8000/expense/get-expenses")
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
    axios
      .delete(`http://localhost:8000/expense/delete-expense/${expense.id}`)
      .then((res) => {
        console.log("Expense deleted successfully");
        list.removeChild(li);
      })
      .catch((error) => {
        mssg.classList.add("error");
        mssg.textContent =
          "Oops! Something went wrong. Please try again later.";
        console.log(error);
      });
    setTimeout(() => {
      mssg.textContent = "";
      mssg.classList.remove("error");
    }, 3000);
  };

  // EDIT BUTTON
  const editBtn = document.createElement("input");
  editBtn.type = "button";
  editBtn.value = "Edit Expense";
  editBtn.style.backgroundColor = "lightBlue";

  editBtn.onclick = () => {
    list.removeChild(li);
    document.getElementById("amount").value = expense.amount;
    document.getElementById("description").value = expense.description;
    document.getElementById("category").value = expense.category;

    //Replace the Existing Event Listener with new one
    myForm.removeEventListener("submit", onSubmit);

    myForm.addEventListener("submit", (e) => {
      console.log("Expense updated successfully");

      const updatedExpense = {
        amount: document.getElementById("amount").value,
        description: document.getElementById("description").value,
        category: document.getElementById("category").value,
      };

      axios
        .put(
          `http://localhost:8000/expense/edit-expense/${expense.id}`,
          updatedExpense
        )
        .then((res) => {
          //Update the user object
          expense.amount = updatedExpense.amount;
          expense.description = updatedExpense.description;
          expense.category = updatedExpense.category;
          //Update the details text node
          details.nodeValue = `${expense.amount} : ${expense.description} : ${expense.category}`;
          //Clear the form after updating
          amountInput.value = "";
          descriptionInput.value = "";
          categoryInput.value = "";
        })
        .catch((error) => console.log(error));

      //Restore the original Event Listener
      myForm.addEventListener("submit", onSubmit);
    });
  };

  li.appendChild(details);
  li.appendChild(deleteBtn);
  li.appendChild(editBtn);
  list.appendChild(li);

  // Clear Fields
  amountInput.value = "";
  descriptionInput.value = "";
  categoryInput.value = "";
}