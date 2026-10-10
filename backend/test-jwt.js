const jwt = require('jsonwebtoken');
const { jwtVerify } = require('jose');

const secretKey = "super_secret_devops_hackathon_key_2026";
const encodedKey = new TextEncoder().encode(secretKey);

async function test() {
  const token = jwt.sign({ teamId: "test", role: "team_leader" }, secretKey, { expiresIn: '1d' });
  console.log("Token:", token);
  try {
    const { payload } = await jwtVerify(token, encodedKey);
    console.log("Verified payload:", payload);
  } catch (err) {
    console.error("Verify error:", err);
  }
}

test();
