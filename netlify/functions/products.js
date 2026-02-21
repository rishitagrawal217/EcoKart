const fs = require('fs');
const path = require('path');

exports.handler = async (event, context) => {
  try {
    // Read products from JSON file
    const productsData = JSON.parse(fs.readFileSync(path.join(__dirname, '../../server/products.json')));
    
    // Flatten products by category
    const flatProducts = productsData.flatMap(cat => 
      cat.products.map(prod => ({ ...prod, category: cat.category }))
    );

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE"
      },
      body: JSON.stringify(flatProducts)
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify({ error: "Failed to fetch products" })
    };
  }
};
