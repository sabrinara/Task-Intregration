
import "next-auth";

declare module "next-auth" {
  interface Profile {
    login?: string;  // GitHub `login` (username) field
  }

  interface Session {
    user: {
      login?: string;  // Custom login property
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }

  interface JWT {
    login?: string;  // JWT should also contain the GitHub `login`
  }
}
