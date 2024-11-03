import { API_BASE_URL } from "../constants/constants";

// Function to get budget from the backend. Method: GET
export const fetchBudget = async (): Promise<number> => {
	try {
		const response = await fetch(`${API_BASE_URL}/budget`, {
			method: "GET"
		});

		// Log the response to check if the fetch request was successful
		console.log("Fetch response status:", response.status);
		console.log("Fetch response details:", response);

		if (!response.ok) {
			throw new Error(`Failed to fetch budget: ${response.status} ${response.statusText}`);
		}

		// Directly await the parsed JSON response
		const jsonResponse = await response.json();
		console.log("data in fetchBudget", jsonResponse);

		return jsonResponse.data; // Assuming 'data' holds the budget value
	} catch (error) {
		console.error("Error fetching budget:", error);
		throw error;
	}
};

// Function to update the budget in the backend. Method: PUT
export const updateBudget = async (budget: number): Promise<number> => {
	const response = await fetch(`${API_BASE_URL}/budget`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({budget}),
    });

    if (!response.ok) {
        throw new Error('Failed to update budget');
    }

	return response.json();
};
