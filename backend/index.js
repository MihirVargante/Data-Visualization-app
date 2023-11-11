const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios');
const app = express();
const ProductModel=require('./model/Product')
const transactionRouter=require('./routes/transactionRoutes')
const statisticRouter=require('./routes/statisticRoutes')
const barChartRouter=require('./routes/barChartRoutes')
const pieChartRouter=require('./routes/pieChartRoutes')
const cors=require('cors')
const PORT=8080
app.use(cors())
app.use(express.json());
const url='mongodb+srv://mihir8955:mihir8955@cluster0.juikcrr.mongodb.net/?retryWrites=true&w=majority&appName=AtlasApp'
const connectDB = async () => {
    try {
      const conn = await mongoose.connect(url, {
        useUnifiedTopology: true,
        useNewUrlParser: true,
      });
  
      console.log(`MongoDB Connected: ${conn.connection.host}`);
      console.log(`MongoDB Port: ${conn.connection.port}`);
      console.log(`MongoDB Database Name: ${conn.connection.name}`);
    } catch (error) {
      console.error(`Error: ${error.message}`);
      process.exit(1);
    }
  };
connectDB()
async function initializeDatabase() {
    try {
      // Fetch data from the third-party API
      const response = await axios.get('https://s3.amazonaws.com/roxiler.com/product_transaction.json');
      const data = response.data;
    //   console.log(data);
      // Initialize the database with seed data if it's empty
      const count = await ProductModel.countDocuments({});
      console.log("count of data in database",count);
      if (count === 0) {
        for (const item of data) {
            const product = new ProductModel({
              id: item.id,
              title: item.title,
              price: item.price,
              description: item.description,
              category: item.category,
              image: item.image,
              sold: item.sold,
              dateOfSale: item.dateOfSale,
            });
            await product.save();
        }
        console.log("database initialized with seed data")
      } else {
        console.log('Database already contains data; no need for initialization.');
      }
    } catch (error) {
      console.error('Error initializing the database:', error);
    }
  }
  // initializeDatabase()

app.use('/api/transaction',transactionRouter)
app.use('/api/statistics',statisticRouter)
app.use('/api/chart',barChartRouter)
app.use('/api/pie-chart',pieChartRouter)
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });