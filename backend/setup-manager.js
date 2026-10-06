require('dotenv').config();
const { MongoClient } = require('mongodb');

async function setup() {
  console.log("Registering manager account via Frontend API...");

  const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";
  const managerEmail = process.env.MANAGER_EMAIL || "11star@gmail.com";
  const managerPassword = process.env.MANAGER_PASSWORD || "11star@#";

  try {
    // 1. Register the user via Better Auth API on the frontend
    const res = await fetch(`${frontendUrl}/api/auth/sign-up/email`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "origin": frontendUrl,
      "referer": `${frontendUrl}/signup`
    },
    body: JSON.stringify({
      email: managerEmail,
      password: managerPassword,
      name: "Admin Manager",
      phone: "01700000000",
      roomNo: "Admin"
    })
  });

  const data = await res.json();
  if (!res.ok) {
    if (data.message && data.message.includes("already exists")) {
      console.log("User already exists, proceeding to upgrade role...");
    } else {
      console.error("Failed to register:", data);
      process.exit(1);
    }
  } else {
    console.log("User registered successfully via API.");
  }

  // 2. Upgrade to Manager via MongoDB
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("MONGODB_URI is not defined in backend/.env");
  }

  const client = new MongoClient(uri);
  await client.connect();

  // better-auth uses the "user" collection by default
  const db = client.db();
  const updateRes = await db.collection('user').updateOne(
    { email: managerEmail },
    { $set: { role: "manager" } }
  );

  console.log(`Successfully updated ${updateRes.modifiedCount} account(s) to 'manager' role.`);
  await client.close();

} catch (err) {
  console.error("Error setting up manager:", err);
}


setup();
