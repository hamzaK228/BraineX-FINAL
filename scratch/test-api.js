
async function testApi() {
  const base = "http://localhost:3000"; // Assuming dev server is on 3000
  try {
    const res = await fetch("http://localhost:3000/api/public/content/scholarships");
    const data = await res.json();
    console.log("Scholarships API Response:", JSON.stringify(data, null, 2));
  } catch (e) {
    console.error("Fetch failed:", e.message);
  }
}
testApi();
