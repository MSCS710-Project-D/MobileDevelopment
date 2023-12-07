
export const saveDriver = async (driverData) => {
    const API_URL = 'https://us-central1-maristhungerexpress.cloudfunctions.net/api/drivers/create'; // Endpoint URL

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(driverData)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to save driver');
        }

        const responseData = await response.json();
        console.log('Driver saved successfully:', responseData);
        return responseData; // Return the saved driver data or any other relevant info

    } catch (error) {
        console.error('Error saving driver:', error);
        throw error; // Re-throw the error so it can be caught and handled by the calling function
    }
};


/**
 * Updates a driver's details.
 * @param {string} driverId - The ID of the driver to update.
 * @param {Object} updatedData - The updated data for the driver.
 * @returns {Promise<Response>} - The response from the fetch call.
 */
export const updateDriver = async (driverId, updatedData) => {
    try {
      const response = await fetch(`https://us-central1-maristhungerexpress.cloudfunctions.net/api/drivers/update/${driverId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          // Include other headers as needed, like authorization tokens
        },
        body: JSON.stringify(updatedData),
      });
  
      if (!response.ok) {
        // If the server response is not ok, throw an error with the status
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json(); // Assuming the server responds with JSON
      return data; // This could be the updated driver object, a success message, etc.
    } catch (error) {
      console.error('Error updating driver:', error);
      throw error; // Rethrow the error so it can be handled by the caller
    }
  };

