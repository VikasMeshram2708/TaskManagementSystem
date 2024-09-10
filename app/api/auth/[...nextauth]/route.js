import { prismaInstance } from "@/helpers/PrismaInstance";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

const handler = NextAuth({
  pages: {
    signIn: "/login",
    newUser: "/signup",
  },
  secret: process.env.NextAuth_SECRET,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: "Credentials",
      async authorize(credentials, req) {
        const res = await fetch("/api/user/signup", {
          method: "POST",
          body: JSON.stringify(credentials),
          headers: { "Content-Type": "application/json" },
        });
        const user = await res.json();

        // If no error and we have user data, return it
        if (res.ok && user) {
          alert(user.message);
          console.log("user-data", user);
          return user;
        }
        // Return null if user data could not be retrieved
        return null;
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      if (account.provider === "google") {
        // Find existing user or create a new one
        let existingUser = await prismaInstance.user.findFirst({
          where: {
            email: user.email,
          },
        });

        if (!existingUser) {
          await prismaInstance.user.create({
            data: {
              firstname: profile.name?.split(" ")[0] || "Google",
              lastname: profile.name?.split(" ").slice(1).join(" ") || "User",
              email: user.email,
              password: "", // No password for OAuth users
            },
          });
        }
      }
      return true; // Return true to allow sign in
    },
    async session({ session, token }) {
      // Attach user ID and access token to the session
      session.user.id = token.id;
      session.accessToken = token.accessToken;

      return session;
    },
  },
});

export { handler as GET, handler as POST };
