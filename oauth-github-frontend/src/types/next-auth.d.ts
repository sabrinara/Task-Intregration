
import "next-auth";

declare module "next-auth" {
  interface Profile {
    login?: string;  
    instance_url?: string | null;   
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
      jira_instance_url?: string | null;
    };
  }

  interface JWT {
    login?: string;  
  }
}
