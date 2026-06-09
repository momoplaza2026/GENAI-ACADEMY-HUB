async function testLocalApi() {
  const url = "http://localhost:3000/api/news";
  const body = {
    title: "Google Gemini 2.5 Released",
    description: "Google has announced Gemini 2.5 with improved capabilities."
  };

  try {
    console.log(`Sending POST request to ${url}...`);
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });

    console.log(`Status code: ${res.status} (${res.statusText})`);
    
    const text = await res.text();
    console.log("Raw Response Body:");
    console.log(text);
  } catch (err) {
    console.error("Fetch request failed:", err);
  }
}

testLocalApi();
