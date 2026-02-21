exports.handler = async (event, context) => {
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "Backend test function is working!",
      event: event.path,
      method: event.httpMethod
    }),
    headers: {
      "Content-Type": "application/json"
    }
  };
};
