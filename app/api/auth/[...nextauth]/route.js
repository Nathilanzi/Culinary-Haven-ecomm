import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import clientPromise from "@/lib/mongodb";
import bcrypt from "bcryptjs";

const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid credentials");
        }

        const client = await clientPromise;
        const db = client.db("devdb");

        // Check if users collection exists, if not create it
        const collections = await db.listCollections().toArray();
        if (!collections.find((c) => c.name === "users")) {
          await db.createCollection("users");
          await db
            .collection("users")
            .createIndex({ email: 1 }, { unique: true });
        }

        const user = await db.collection("users").findOne({
          email: credentials.email,
        });

        if (!user || !user.password) {
          throw new Error("No user found");
        }

        const passwordMatch = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!passwordMatch) {
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

        // Check if users collection exists, if not create it
        const collections = await db.listCollections().toArray();
        if (!collections.find((c) => c.name === "users")) {
          await db.createCollection("users");
          await db
            .collection("users")
            .createIndex({ email: 1 }, { unique: true });
        }

        const existingUser = await db.collection("users").findOne({
          email: user.email,
        });

        if (!existingUser) {
          await db.collection("users").insertOne({
            email: user.email,
            name: user.name,
            image: user.image,
            googleId: account.providerAccountId,
            createdAt: new Date(),
          });
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
    signUp: "/auth/signup",
  },
  session: {
    strategy: "jwt",
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
