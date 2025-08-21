import React from "react";

interface Props {
  children: React.ReactNode;
}

const Layout = ({ children }: Props) => (
  <div className="min-h-screen bg-muted flex items-center justify-center">
    <div className="w-full max-w-3xl">{children}</div>
  </div>
);

export default Layout;


