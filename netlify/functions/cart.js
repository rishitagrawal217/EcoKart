exports.handler = async (event, context) => {
  const { method } = event;
  
  if (method === 'GET') {
    // Mock cart data
    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE"
      },
      body: JSON.stringify({
        items: [],
        total: 0,
        message: "Mock cart - please implement real cart functionality"
      })
    };
  }
  
  return {
    statusCode: 405,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*"
    },
    body: JSON.stringify({ error: "Method not allowed" })
  };
};
