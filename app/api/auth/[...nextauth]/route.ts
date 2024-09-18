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
        console.log("cred-user-da", user);

        return {
          id: user?.id,
          firstname: user?.firstname,
          lastname: user?.lastname,
          email: user?.email,
        };
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
    async session({ session, token }) {
      // console.log("Session callback - token:", token); // Debugging line

      // Ensure session.user exists
      if (session.user) {
        session.user.email = token.email;
        // Add firstname and lastname from the token to the session
        // @ts-ignore
        session.user.firstname = token.firstname;
        // @ts-ignore
        session.user.lastname = token.lastname;
      }

      console.log("Session callback - session:", session); // Debugging line
      return session;
    },
    async jwt({ token, user }) {
      // On initial sign in
      if (user) {
        token.email = user.email;
        // @ts-ignore
        token.firstname = user.firstname || user.name?.split(" ")[0];
        // @ts-ignore
        token.lastname = user.lastname || user.name?.split(" ").pop();
      }
      // console.log("JWT callback - token:", token); // Debugging line
      return token;
    },
  },
  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
  },
});

export { handler as GET, handler as POST };
