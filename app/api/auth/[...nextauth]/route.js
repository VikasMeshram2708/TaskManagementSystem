import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import { prismaInstance } from "helpers/PrismaInstance";

const handler = NextAuth({
  pages: {
    signIn: "/login",
    newUser: "/signup",
  },
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: "Credentials",
      async authorize(credentials) {
        const { email, password } = credentials;
        // Find the user by email
        const user = await prismaInstance.user.findUnique({
          where: {
            email: email,
          },
          select: {
            id: true,
            email: true,
            password: true,
            firstname: true,
            lastname: true,
          },
        });
        // Handle user not found or invalid password
        if (!user || !(await bcrypt.compare(password, user.password))) {
          return null; // Return null if authentication fails
        }
        // Return the user object without the password
        const { password: _, ...userWithoutPassword } = user;
        return userWithoutPassword; // Return the user object if authentication is successful
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account.provider === "google") {
        try {
          // Find existing user or create a new one
          let existingUser = await prismaInstance.user.findFirst({
            where: { email: user.email },
          });
          if (!existingUser) {
            await prismaInstance.user.create({
              data: {
                firstname: profile.given_name || "Google",
                lastname: profile.family_name || "User",
                email: user.email,
                password: "", // No password for OAuth users
              },
            });
          }
          return true; // Continue with the login process
        } catch (error) {
          console.error("Error signing in with Google:", error);
          return false; // Prevent login if there is an error
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.firstname = user.firstname;
        token.lastname = user.lastname;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.firstname = token.firstname;
      session.user.lastname = token.lastname;
      session.accessToken = token.accessToken;
      return session;
    },
    authorized({ req, token }) {
      console.log("au-token", token);
      if (token) return true; // If there is a token, the user is authenticated
    },
  },
});

export { handler as GET, handler as POST };