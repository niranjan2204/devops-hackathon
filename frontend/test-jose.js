const jwt = require('jsonwebtoken');
const { jwtVerify } = require('jose');

const secretKey = "super_secret_devops_hackathon_key_2026";
const encodedKey = new TextEncoder().encode(secretKey);

async function test() {
  // sign using jsonwebtoken (like backend does)
  const token = jwt.sign({ teamId: "test", role: "team_leader" }, secretKey, { expiresIn: '1d' });
  console.log("Token from jsonwebtoken:", token);
  
  try {
    // verify using jose (like frontend middleware does)
    const { payload } = await jwtVerify(token, encodedKey);
    console.log("Verified payload in jose:", payload);
  } catch (err) {
    console.error("Jose Verify Error:", err);
  }
}

test();
