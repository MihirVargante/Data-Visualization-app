const express = require('express');
const router = express.Router();
const ProductModel = require('../model/Product');

router.get('/', async (req, res) => {
  const selectedMonth = req.query.month || '6';

  try {
    // Fetch all data from the database
    const allTransactions = await ProductModel.find();

    // Filter data by month 
    const filteredTransactions = allTransactions.filter((transaction) => {
      const transactionDate = new Date(transaction.dateOfSale);
      return transactionDate.getUTCMonth() === parseInt(selectedMonth) - 1; // Month is 0-based
    });

    // Count the number of items in each category
    const categoryCounts = {};

    filteredTransactions.forEach((transaction) => {
      const category = transaction.category;
      if (categoryCounts[category]) {
        categoryCounts[category]++;
      } else {
        categoryCounts[category] = 1;
      }
    });

    res.json(categoryCounts);
  } catch (error) {
    console.error('Error fetching pie chart data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
