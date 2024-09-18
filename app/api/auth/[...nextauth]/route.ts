/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { prismaInstance } from "@/lib/PrismaInstance";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";

// const BASE_URL = process.env.NEXTAUTH_URL;

const handler = NextAuth({
  pages: {
    signIn: "/login",
    newUser: "/signup",
  },
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
        },
        password: {
          label: "Password",
        },
      },
      // @ts-ignore
      async authorize(credentials) {
        if (!credentials) return;
        const { email, password } = credentials;

        // Find the user by email
        const user = await prismaInstance.user.findUnique({
          where: {
            email: email,
          },
        });

        // Handle user not found or invalid password
        if (!user || !(await bcrypt.compare(password, user.password))) {
          return null; // Return null if authentication fails
        }

        return user; // Return the user object if authentication is successful
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
    async session({ session, token, user }) {
      if (session.user) {
        session.user.email = token.email;
        // @ts-ignore
        session.user.firstname = token.firstname;
        // @ts-ignore
        session.user.lastname = token.lastname;
      }
      return session;
    },
    async jwt({ token, user, account, profile, isNewUser }) {
      if (user) {
        console.log("user", user);
        token.email = user.email;
        token.firstname = user.name?.split(" ")[0];
        token.lastname = user.name?.split(" ").pop();
      }
      return token;
    },
  },
  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
  },
});

export { handler as GET, handler as POST };
