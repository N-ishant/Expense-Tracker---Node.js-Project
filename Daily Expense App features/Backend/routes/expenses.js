const express = require("express");
const router = express.Router();

const expensesController = require("../controllers/expenses");

router.get("/get-expenses", expensesController.getAllExpenses);
router.post("/add-expense", expensesController.postAddExpense);
router.delete("/delete-expense/:id", expensesController.deleteExpense);
router.put("/edit-expense/:id", expensesController.editExpense);

module.exports = router;