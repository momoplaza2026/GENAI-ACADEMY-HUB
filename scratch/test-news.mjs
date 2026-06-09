import fetch from 'node-fetch';

async function testNews() {
  const url = "https://newsdata.io/api/1/latest?apikey=pub_4ac0f9a59c4a4506a850fa9d493e8293&q=artificial%20intelligence";
  try {
    console.log("Fetching latest AI news from newsdata.io...");
    const res = await fetch(url);
    const data = await res.json();
    console.log("API Status:", data.status);
    console.log("Total Results:", data.totalResults);
    
    if (data.results && data.results.length > 0) {
      console.log("Sample article structure (first result):");
      console.dir(data.results[0], { depth: null });
    } else {
      console.log("No articles found in results. Full response:", data);
    }
  } catch (err) {
    console.error("Fetch failed:", err);
  }
}

testNews();
