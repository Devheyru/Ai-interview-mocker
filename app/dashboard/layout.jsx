import React from "react";

function DashboardLayout({ children }) {
  return (
    <div>
      <div className="mx-5 md:mx-20m lg:mx-36">{children}</div>
    </div>
  );
}

export default DashboardLayout;