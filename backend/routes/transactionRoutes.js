const express = require('express');
const router = express.Router();
const ProductModel=require('../model/Product')

router.post('/', async (req, res) => {
  console.log("we are in backend yayy")
  console.log(req.body)
    const page = parseInt(req.body.currentPage) || 1;
    const perPage = 10;
    const search = req.body.search || '';
    const selectedMonth = req.body.month|| '';

    try {
        const skip = (page - 1) * perPage;
        const titleAndDescriptionQuery = {
          $or: [
            { title: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } },
          ],
        };
        const priceQuery = { price: { $gte: parseFloat(search) || 0 } };

        const query = {
          $and: [titleAndDescriptionQuery, priceQuery],
        };
    
        // Fetch all data from the database
        const allTransactions = await ProductModel.find(query);
        if(selectedMonth===''){
          const all = allTransactions.slice(skip, skip + perPage);
          return res.json({ transactions: all})
        }
        // console.log(allTransactions)
        // Filter data by month using JavaScript
        const filteredTransactions = allTransactions.filter((transaction) => {
          const transactionDate = new Date(transaction.dateOfSale);
          return transactionDate.getUTCMonth() === parseInt(selectedMonth) - 1; // Month is 0-based
        });
        console.log("total docments",filteredTransactions.length)
        const paginatedTransactions = filteredTransactions.slice(skip, skip + perPage);
    
        console.log("after search:",paginatedTransactions.length);
        res.json({ transactions: paginatedTransactions });
    } catch (error) {
      console.error('Error fetching transactions:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  module.exports = router;  