import React from "react";

interface Props {
  children: React.ReactNode;
}

const Layout = ({ children }: Props) => (
  <div className="min-h-screen bg-muted flex items-center justify-center py-12">
    <div className="w-full max-w-2xl">{children}</div>
  </div>
);

export default Layout;
