/* eslint-disable @typescript-eslint/no-unused-vars */
import { prismaInstance } from "@/lib/PrismaInstance";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

const BASE_URL = process.env.NEXTAUTH_URL;

const handler = NextAuth({
  pages: {
    signIn: "/login",
    newUser: "/signup",
  },
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "Email",
        },
        password: {
          password: "Password",
          type: "password",
          placeholder: "Password",
        },
      },
      async authorize(credentials) {
        if (!credentials) return null;
        const { email, password } = credentials;
        try {
          const res = await fetch(`${BASE_URL}/api/user/login`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email,
              password,
            }),
          });

          if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || "Login failed");
          }
          const user = await res.json();
          console.log("creds-user", user);
          return {
            id: user?.id,
            firstname: user?.firstname,
            lastname: user?.lastname,
            email: user?.email,
          };
        } catch (error) {
          console.error("Authentication error:", error);
          return null;
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        try {
          const existingUser = await prismaInstance.user.findUnique({
            where: { email: user.email! },
          });

          if (!existingUser) {
            await prismaInstance.user.create({
              data: {
                email: user.email!,
                firstname: user.name?.split(" ")[0] || "",
                lastname: user.name?.split(" ").pop() || "",
                password: "",
              },
            });
          }
        } catch (error) {
          console.error("Error saving Google user to database:", error);
          return false;
        }
      }
      return true;
    },
    async redirect({ url, baseUrl }) {
      return baseUrl;
    },
    async session({ session, token }) {
      if (token) {
        session.user = token;
      }
      return session;
    },
    async jwt({ token, user, account, profile, isNewUser }) {
      if (user) {
        console.log("user", user);
        (token.email = user.email),
          (token.firstname = user?.name?.split(" ")[0]);
        token.lastname = user?.name?.split(" ").pop();
      }
      return token;
    },
  },
  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
  },
});

export { handler as GET, handler as POST };
