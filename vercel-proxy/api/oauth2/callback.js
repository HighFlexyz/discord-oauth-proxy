const axios = require('axios');

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // Get your actual server URL from environment variable
    const SERVER_URL = process.env.SERVER_URL || 'https://ban-examining-poster-fate.trycloudflare.com';
    
    // Forward the request to your actual server
    const targetUrl = `${SERVER_URL}/oauth2/callback`;
    
    // Forward query parameters
    const queryString = new URLSearchParams(req.query).toString();
    const fullUrl = queryString ? `${targetUrl}?${queryString}` : targetUrl;
    
    console.log('Proxying request to:', fullUrl);
    
    // Make request to your actual server
    const response = await axios({
      method: req.method,
      url: fullUrl,
      data: req.body,
      headers: {
        'Content-Type': req.headers['content-type'] || 'application/json',
        'User-Agent': 'Vercel-Proxy/1.0'
      },
      timeout: 30000
    });
    
    // Forward the response
    res.status(response.status);
    
    // Forward response headers (except some that might cause issues)
    Object.keys(response.headers).forEach(key => {
      if (!['content-encoding', 'transfer-encoding', 'connection'].includes(key.toLowerCase())) {
        res.setHeader(key, response.headers[key]);
      }
    });
    
    return res.send(response.data);
    
  } catch (error) {
    console.error('Proxy error:', error.message);
    
    if (error.response) {
      // Forward error response from your server
      res.status(error.response.status);
      return res.json({
        error: 'Proxy Error',
        message: error.response.data || error.message,
        status: error.response.status
      });
    } else {
      // Network or other error
      res.status(500);
      return res.json({
        error: 'Proxy Connection Error',
        message: 'Could not connect to backend server',
        details: error.message
      });
    }
  }
}
