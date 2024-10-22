import type { Metadata } from "next";


export const metadata: Metadata = {
  title: "Api Integration",
  description: "Github notion tello api integration",
};

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      
      {children}
   
    </div>
  );
}