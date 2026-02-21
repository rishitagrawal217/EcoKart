exports.handler = async (event, context) => {
  try {
    // Hardcoded sample products for immediate working demo
    const products = [
      {
        _id: "1",
        name: "Eco-Friendly Water Bottle",
        price: 15.99,
        image: "https://images.unsplash.com/photo-1602143407391-60bcfb692a2a?w=300",
        description: "Reusable stainless steel water bottle",
        category: "Kitchen",
        ecoFriendly: true,
        ecoPoints: 10
      },
      {
        _id: "2", 
        name: "Bamboo Cutting Board",
        price: 25.99,
        image: "https://images.unsplash.com/photo-1556909128-649779dc9b69?w=300",
        description: "Sustainable bamboo cutting board",
        category: "Kitchen",
        ecoFriendly: true,
        ecoPoints: 15
      },
      {
        _id: "3",
        name: "Organic Cotton T-Shirt",
        price: 29.99,
        image: "https://images.unsplash.com/photo-1521572163464-3d84806f7d1f?w=300",
        description: "100% organic cotton t-shirt",
        category: "Fashion",
        ecoFriendly: true,
        ecoPoints: 20
      },
      {
        _id: "4",
        name: "Reusable Shopping Bags",
        price: 12.99,
        image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300",
        description: "Set of 5 reusable cotton shopping bags",
        category: "Home",
        ecoFriendly: true,
        ecoPoints: 25
      },
      {
        _id: "5",
        name: "Solar Power Bank",
        price: 45.99,
        image: "https://images.unsplash.com/photo-1593079836374-b1f842ba4823?w=300",
        description: "20000mAh solar powered power bank",
        category: "Electronics",
        ecoFriendly: true,
        ecoPoints: 30
      }
    ];

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE"
      },
      body: JSON.stringify(products)
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
