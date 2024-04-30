const User = require("../models/user");
const Expense = require("../models/expense");

exports.getUserLeaderBoard = async (req, res, next) => {
  try {
    const users = await User.findAll();
    const expenses = await Expense.findAll();
    const userAggregatedExpenses = {};
    expenses.forEach((expense) => {
      if (userAggregatedExpenses[expense.userId]) {
        userAggregatedExpenses[expense.userId] =
          userAggregatedExpenses[expense.userId] + expense.amount;
      } else {
        userAggregatedExpenses[expense.userId] = expense.amount;
      }
    });

    var userLeaderBoardDetails = [];

    users.forEach((user) => {
      userLeaderBoardDetails.push({
        name: user.dataValues.username,
        totalExpenses: userAggregatedExpenses[user.id] || 0,
      });
    });

    console.log(userLeaderBoardDetails);
    userLeaderBoardDetails.sort((a, b) => b.totalExpenses - a.totalExpenses);
    res.status(200).json({ success: true, userLeaderBoardDetails });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, error });
  }
};