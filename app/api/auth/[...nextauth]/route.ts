/* eslint-disable @typescript-eslint/no-unused-vars */
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const NEXT_BASE_URL = process.env.NEXTAUTH_URL;

const handler = NextAuth({
  pages: {
    signIn: "/login",
    newUser: "/signup",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials) return null;
        const { email, password } = credentials;
        try {
          const res = await fetch(`${NEXT_BASE_URL}/api/user/login`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: email,
              password: password,
            }),
          });
          const result = await res.json();
          console.log("API login response:", result);

          if (res.ok && result.message === "User logged in successfully") {
            // Since the API doesn't return user data, we'll create a minimal user object
            // You may want to make another API call here to fetch user details if needed
            return {
              id: result?.user?.id,
              name: result?.user?.name,
              email: result?.user?.email,
            };
          } else {
            // If login was not successful, return null
            console.error("Login failed:", result.message);
            return null;
          }
        } catch (error) {
          console.error("Error in authorize:", error);
          return null;
        }
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 60 * 60, // 1 hour
  },
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      return true;
    },
    async redirect({ url, baseUrl }) {
      return baseUrl;
    },
    async session({ session, user, token }) {
      if (token) {
        session.user = token;
      }
      return session;
    },
    async jwt({ token, user, account, profile, isNewUser }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
      }
      return token;
    },
  },
  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
  },
});

export { handler as GET, handler as POST };
