import React from "react";
import Header from "./header";

function Main({ children }: any) {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col items-center justify-start p-4">
      <Header />
      <div className="w-[70%]">{children}</div>
    </div>
  );
}

export default Main;
