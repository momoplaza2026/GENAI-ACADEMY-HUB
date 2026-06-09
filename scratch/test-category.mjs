async function testCategory() {
  const apikey = "pub_4ac0f9a59c4a4506a850fa9d493e8293";
  const q = "artificial intelligence";
  // Filter by category=technology
  const url = `https://newsdata.io/api/1/latest?apikey=${apikey}&q=${encodeURIComponent(q)}&language=en&category=technology`;
  
  try {
    console.log("Fetching latest tech AI news...");
    const res = await fetch(url);
    const data = await res.json();
    console.log("API Status:", data.status);
    console.log("Total Results:", data.totalResults);
    
    if (data.results && data.results.length > 0) {
      console.log("Returned Headlines:");
      data.results.slice(0, 5).forEach((art, i) => {
        console.log(`${i + 1}. [${art.source_name}] ${art.title} (Category: ${art.category?.join(", ")})`);
      });
    } else {
      console.log("No articles found:", data);
    }
  } catch (err) {
    console.error("Fetch failed:", err);
  }
}

testCategory();
