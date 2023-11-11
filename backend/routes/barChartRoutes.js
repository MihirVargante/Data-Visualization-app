const express = require('express');
const router = express.Router();
const ProductModel=require('../model/Product')

router.get('/', async (req, res) => {
    const selectedMonth = req.query.month || '6';
  
    try {
      // Define the price ranges
      const priceRanges = [
        { min: 0, max: 100 },
        { min: 101, max: 200 },
        { min: 201, max: 300 },
        { min: 301, max: 400 },
        { min: 401, max: 500 },
        { min: 501, max: 600 },
        { min: 601, max: 700 },
        { min: 701, max: 800 },
        { min: 801, max: 900 },
        { min: 901, max: Number.POSITIVE_INFINITY },
      ];
  
      // Fetch all data from the database
      const allTransactions = await ProductModel.find();
  
      // Filter data by month using JavaScript
      const filteredTransactions = allTransactions.filter((transaction) => {
        const transactionDate = new Date(transaction.dateOfSale);
        return transactionDate.getUTCMonth() === parseInt(selectedMonth) - 1; // Month is 0-based
      });
  
      // Count the number of items in each price range
      const priceRangeCounts = priceRanges.map((range) => {
        const count = filteredTransactions.filter((transaction) => {
          return transaction.price >= range.min && transaction.price <= range.max;
        }).length;
        return {
          range: `${range.min} - ${range.max}`,
          count,
        };
      });
  
      res.json({ priceRangeCounts });
    } catch (error) {
      console.error('Error fetching bar chart data:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
  module.exports = router;