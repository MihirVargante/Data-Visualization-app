const express = require('express');
const router = express.Router();
const ProductModel=require('../model/Product')
router.get('/', async (req, res) => {
    const selectedMonth = req.query.month || '6';
    console.log("we are inside statistic",selectedMonth)
    try {

        // Fetch all data from the database
        const allTransactions = await ProductModel.find();
        console.log(allTransactions.length)
        // Filter data by month using JavaScript
        const filteredTransactions = allTransactions.filter((transaction) => {
          const transactionDate = new Date(transaction.dateOfSale);
          return transactionDate.getUTCMonth() === parseInt(selectedMonth) - 1; // Month is 0-based
        });
        console.log("total docments",filteredTransactions.length)

        const totalSaleAmount =filteredTransactions.reduce((total, transaction) => total + transaction.price, 0);
        const totalSoldItems = filteredTransactions.filter((transaction) => transaction.sold).length;
        const totalNotSoldItems = filteredTransactions.filter((transaction) => !transaction.sold).length;
        
        // console.log(paginatedTransactions);
        res.json({
            totalsales:totalSaleAmount,
            sold:totalSoldItems,
            unsold:totalNotSoldItems,
        });
    } catch (error) {
      console.error('Error fetching transactions:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  module.exports = router;  