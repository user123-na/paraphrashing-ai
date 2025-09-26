const API_KEY = "AIzaSyBnGD8LEybf14WQbRihl3d4suaizI5dBrM"; // Replace with your real Gemini API key

document.getElementById("paraphrase").addEventListener("click", async () => {
    const inputText = document.getElementById("original").value.trim();
    const style = document.getElementById("style").value;
    const resultBox = document.getElementById("result");

    if (!inputText) {
        resultBox.value = "Please enter text to paraphrase.";
        return;
    }

    resultBox.value = "Generating paraphrase...";

    const styledPrompt = `Paraphrase the following text in a ${style} style:\n${inputText}`;

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;
    const data = {
        contents: [
            {
                parts: [
                    { text: styledPrompt }
                ]
            }
        ]
    };

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();
        const generatedText = result?.candidates?.[0]?.content?.parts?.[0]?.text;
        resultBox.value = generatedText || "No paraphrased text received.";
    } catch (error) {
        console.error("Error:", error);
        resultBox.value = "An error occurred. Check console for details.";
    }
});

document.getElementById("original").addEventListener("input", () => {
    const text = document.getElementById("original").value;
    const words = text.trim().split(/\s+/).filter(Boolean).length;
    document.getElementById("wordCount").textContent = words;
});

document.getElementById("copy").addEventListener("click", () => {
    const resultText = document.getElementById("result");
    resultText.select();
    document.execCommand("copy");
});
