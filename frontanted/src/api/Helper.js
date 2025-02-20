export const fetchData = async (url, method = "GET", body = null, isFormData = false) => {
    try {
      const options = {
        method,
        headers: isFormData ? {} : { "Content-Type": "application/json" },
        body: isFormData ? body : JSON.stringify(body),
      };
  
      const response = await fetch(url, options);
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
      }
  
      return data;
    } catch (error) {
      throw error;
    }
  };
  