// Test script to verify GitHub API connection
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

console.log("🔍 Testing GitHub API Connection...\n");
console.log("GitHub Token:", GITHUB_TOKEN ? "✅ Found" : "❌ Missing");

async function testGitHubAPI() {
  try {
    // Test 1: Check GitHub API authentication
    console.log("\n📡 Test 1: Checking GitHub API authentication...");
    const authResponse = await axios.get("https://api.github.com/user", {
      headers: {
        Authorization: `token ${GITHUB_TOKEN}`,
        "User-Agent": "contribution-analyzer",
      },
    });
    console.log("✅ Authentication successful!");
    console.log("   Authenticated as:", authResponse.data.login);
    console.log(
      "   Rate limit remaining:",
      authResponse.headers["x-ratelimit-remaining"]
    );

    // Test 2: Fetch a sample repository
    console.log("\n📡 Test 2: Testing repository access...");
    const repoResponse = await axios.get(
      "https://api.github.com/repos/facebook/react/contributors",
      {
        headers: {
          Authorization: `token ${GITHUB_TOKEN}`,
          "User-Agent": "contribution-analyzer",
        },
      }
    );
    console.log("✅ Repository access successful!");
    console.log("   Contributors found:", repoResponse.data.length);

    console.log("\n✅ All tests passed! Your backend should work correctly.");
  } catch (error) {
    console.error("\n❌ Error occurred:");
    if (error.response) {
      console.error("   Status:", error.response.status);
      console.error("   Message:", error.response.data.message);
      if (error.response.status === 401) {
        console.error(
          "\n⚠️  Your GitHub token appears to be invalid or expired."
        );
        console.error(
          "   Please check your .env file and ensure the token is correct."
        );
      }
      if (error.response.status === 403) {
        console.error("\n⚠️  Rate limit exceeded or token lacks permissions.");
        console.error(
          "   Rate limit remaining:",
          error.response.headers["x-ratelimit-remaining"]
        );
      }
    } else {
      console.error("   Error:", error.message);
    }
  }
}

testGitHubAPI();
