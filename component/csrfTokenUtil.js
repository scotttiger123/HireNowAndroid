// csrfTokenUtil.js

const getCsrfToken = async () => {
    const apiUrl = 'https://hirenow.site/csrf-token';
  
    try {
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (!response) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const responseData = await response.json();
      console.log("csrf",responseData);
      return  responseData.csrf_token;
          
    } catch (error) {
      console.error('Fetch error:', error);
      throw new Error('Error fetching CSRF token');
    }
  };
  
  export default getCsrfToken;
  