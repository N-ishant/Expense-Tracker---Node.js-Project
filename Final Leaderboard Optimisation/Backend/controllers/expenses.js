const Expense = require("../models/expense");
const User = require("../models/user");

exports.getAllExpenses = async (req, res, next) => {
  try {
    const expenses = await Expense.findAll({ where: { userId: req.user.id } });
    console.log(expenses);
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
      userId: req.user.id,
    });

    const totalExpense = Number(req.user.totalExpenses) + Number(amount);
    console.log(totalExpense);
    await User.update(
      { totalExpenses: totalExpense },
      { where: { id: req.user.id } }
    );

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

    const noOfRows = await Expense.destroy({
      where: { id: expenseId, userId: req.user.id },
    });

    if (noOfRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Expense does not belong to the user",
      });
    }

    return res
      .status(200)
      .json({ success: true, message: "Deleted Successfully" });
  } catch (err) {
    console.log(err);
    res.sendStatus(500).json(err);
  }
};