// Inside your "Submit" button function

const checkFraud = async () => {
    // 1. Gather data from your form inputs
    const formData = {
        amount: 15000,       // Example value from input field
        time: 12,            // Example value
        location_code: 5     // Example value
    };

    try {
        // 2. Send it to your Python Backend
        const response = await fetch('http://127.0.0.1:5000/predict', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });

        // 3. Receive the answer
        const data = await response.json();
        
        console.log("Prediction:", data.prediction);
        alert(`Result: ${data.prediction}`);

    } catch (error) {
        console.error("Error connecting to backend:", error);
    }
};