
import "next-auth";

declare module "next-auth" {
  interface Profile {
    login?: string;  
  }

  interface Session {
    user: {
      login?: string;  
      name?: string | null;
      email?: string | null;
      image?: string | null;
      avatar_url?: string | null;
      image_original?: string | null;
      provider?: string ;
    };
  }

  interface JWT {
    login?: string;  
  }
}
