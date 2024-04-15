const Expense = require("../models/expense");

exports.getAllExpenses = async (req, res, next) => {
  try {
    const expenses = await Expense.findAll();
    res.status(200).json({ success: true, allExpenses: expenses });
  } catch (err) {
    console.log("Get Expense is failing", JSON.stringify(err));
    res.status(500).json({ success: false, error: err });
  }
};

exports.postAddExpense = async (req, res, next) => {
  try {
    if (!req.body.amount) {
      throw new Error("Amnount is Mandatory");
    }

    if (!req.body.description) {
      throw new Error("Description is Mandatory");
    }

    const amount = req.body.amount;
    const description = req.body.description;
    const category = req.body.category;

    const expenseData = await Expense.create({
      amount: amount,
      description: description,
      category: category,
    });

    res.status(201).json({ success: true, newExpenseData: expenseData });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, error: err });
  }
};

exports.deleteExpense = async (req, res, next) => {
  try {
    const expenseId = req.params.id;
    if (expenseId == "undefined") {
      console.log("ID is missing");
      res.status(400).json({ success: false, err: "ID is missing" });
    }
    await Expense.destroy({ where: { id: expenseId } });
    res.sendStatus(200);
  } catch (err) {
    console.log(err);
    res.sendStatus(500).json(err);
  }
};

exports.editExpense = async (req, res, next) => {
  try {
    const expenseId = req.params.id;
    const updatedAmount = req.body.amount;
    const updatedDescription = req.body.description;
    const updatedCategory = req.body.category;

    const expense = await Expense.findByPk(expenseId);
    if (!expense) {
      return res
        .status(404)
        .json({ success: false, error: "Expense not found" });
    }

    expense.amount = updatedAmount;
    expense.description = updatedDescription;
    expense.category = updatedCategory;

    const result = await expense.save();
    console.log("UPDATED EXPENSE!");

    res
      .status(200)
      .json({
        success: false,
        message: "Expense updated successfully",
        expense: result,
      });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};