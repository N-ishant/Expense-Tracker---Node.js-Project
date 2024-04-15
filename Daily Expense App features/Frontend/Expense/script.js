const myForm = document.getElementById("my-form");
const amountInput = document.getElementById("amount");
const descriptionInput = document.getElementById("description");
const categoryInput = document.getElementById("category");
const list = document.getElementById("list");
const mssg = document.querySelector(".msg");

myForm.addEventListener("submit", onSubmit);

async function onSubmit(e) {
  e.preventDefault();

  try {
    const amount = amountInput.value;
    const description = descriptionInput.value;
    const category = categoryInput.value;

    const expense = {
      amount,
      description,
      category,
    };

    const res = await axios.post(
      "http://localhost:8000/expense/add-expense",
      expense
    );
    showExpenseOnScreen(res.data.newExpenseData);
    console.log(res);
  } catch (error) {
    mssg.classList.add("error");
    mssg.textContent = "Something went wrong";
    console.error(error);
  }
  setTimeout(() => {
    mssg.textContent = "";
    mssg.classList.remove("error");
  }, 3000);
}

window.addEventListener("DOMContentLoaded", async () => {
  try {
    const res = await axios.get("http://localhost:8000/expense/get-expenses");
    console.log(res);
    for (let i = 0; i < res.data.allExpenses.length; i++) {
      showExpenseOnScreen(res.data.allExpenses[i]);
    }
  } catch (error) {
    mssg.classList.add("error");
    mssg.textContent = "Internal Server Error. Please try again later.";
    console.log(error);
  }
  setTimeout(() => {
    mssg.textContent = "";
    mssg.classList.remove("error");
  }, 3000);
});

async function showExpenseOnScreen(expense) {
  const li = document.createElement("li");
  const details = document.createTextNode(
    `${expense.amount} : ${expense.description} : ${expense.category}`
  );

  const deleteBtn = document.createElement("input");
  deleteBtn.type = "button";
  deleteBtn.value = "Delete Expense";
  deleteBtn.style.color = "white";
  deleteBtn.style.backgroundColor = "Red";

  deleteBtn.onclick = async () => {
    try {
      await axios.delete(
        `http://localhost:8000/expense/delete-expense/${expense.id}`
      );
      console.log("Expense deleted successfully");
      list.removeChild(li);
    } catch (error) {
      mssg.classList.add("error");
      mssg.textContent = "Oops! Something went wrong. Please try again later.";
      console.error(error);
    }
    setTimeout(() => {
      mssg.textContent = "";
      mssg.classList.remove("error");
    }, 3000);
  };

  const editBtn = document.createElement("input");
  editBtn.type = "button";
  editBtn.value = "Edit Expense";
  editBtn.style.backgroundColor = "lightBlue";

  editBtn.onclick = () => {
    list.removeChild(li);
    amountInput.value = expense.amount;
    descriptionInput.value = expense.description;
    categoryInput.value = expense.category;

    myForm.removeEventListener("submit", onSubmit);

    myForm.addEventListener("submit", async (e) => {
      console.log("Expense updated successfully");

      const updatedExpense = {
        amount: amountInput.value,
        description: descriptionInput.value,
        category: categoryInput.value,
      };

      try {
        const res = await axios.put(
          `http://localhost:8000/expense/edit-expense/${expense.id}`,
          updatedExpense
        );
        expense.amount = updatedExpense.amount;
        expense.description = updatedExpense.description;
        expense.category = updatedExpense.category;
        details.nodeValue = `${expense.amount} : ${expense.description} : ${expense.category}`;
        amountInput.value = "";
        descriptionInput.value = "";
        categoryInput.value = "";
        console.log(res);
      } catch (error) {
        console.log(error);
      }

      myForm.addEventListener("submit", onSubmit);
    });
  };

  li.appendChild(details);
  li.appendChild(deleteBtn);
  li.appendChild(editBtn);
  list.appendChild(li);

  amountInput.value = "";
  descriptionInput.value = "";
  categoryInput.value = "";
}