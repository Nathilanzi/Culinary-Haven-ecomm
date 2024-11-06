import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import clientPromise from "./mongodb";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid credentials");
        }

        const client = await clientPromise;
        const db = client.db("devdb");
        const user = await db.collection("users").findOne({
          email: credentials.email,
        });

        if (!user) {
          throw new Error("User not found");
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isPasswordValid) {
          throw new Error("Invalid password");
        }

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        const client = await clientPromise;
        const db = client.db("devdb");

        const existingUser = await db.collection("users").findOne({
          email: user.email,
        });

        if (!existingUser) {
          await db.collection("users").insertOne({
            email: user.email,
            name: user.name,
            googleId: user.id,
            image: user.image,
            createdAt: new Date(),
          });
        } else if (!existingUser.googleId) {
          await db
            .collection("users")
            .updateOne({ email: user.email }, { $set: { googleId: user.id } });
        }
      }
      return true;
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.id = token.sub;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  session: {
    strategy: "jwt",
  },
};
