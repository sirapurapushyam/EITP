import { OAuth2Client } from "google-auth-library";
import { env } from "../config/env.js";

const client = new OAuth2Client(env.GOOGLE_CLIENT_ID);

export async function verifyGoogleToken(idToken) {
  try {
    console.log("========== GOOGLE DEBUG ==========");
    console.log("CLIENT ID:", env.GOOGLE_CLIENT_ID);
    console.log("Token length:", idToken?.length);

    const ticket = await client.verifyIdToken({
      idToken,
      audience: env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    console.log("Payload:", payload);

    if (!payload) {
      throw new Error("Invalid Google token");
    }

    return {
      googleId: payload.sub,
      email: payload.email,
      name: payload.name,
      picture: payload.picture,
      emailVerified: payload.email_verified,
    };
  } catch (err) {
    console.error("========== GOOGLE VERIFY ERROR ==========");
    console.error("Message:", err.message);
    console.error("Code:", err.code);
    console.error("Status:", err.status);

    if (err.response) {
      console.error("Response Status:", err.response.status);
      console.error("Response Data:", err.response.data);
    }

    console.error(err);

    throw err;
  }
}