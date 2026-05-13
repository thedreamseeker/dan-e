export async function chatWithDanE(messages: { role: 'user' | 'model', content: string }[]) {
  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ messages }),
    });

    if (!response.ok) {
      throw new Error(`Server responded with ${response.status}`);
    }

    const data = await response.json();
    return data.message || "I'm sorry, I couldn't generate a response.";
  } catch (error) {
    console.error("Error communicating with API:", error);
    return "I'm sorry, I'm having a bit of trouble connecting to my neural network right now. Please try again in a moment.";
  }
}
