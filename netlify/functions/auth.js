exports.handler = async (event, context) => {
  const { method } = event;
  
  if (method === 'POST') {
    // Mock authentication for demo
    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE"
      },
      body: JSON.stringify({
        message: "Mock authentication - please implement real auth",
        user: { email: "demo@ecokart.com", name: "Demo User", ecoPoints: 100 },
        token: "mock-jwt-token"
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
