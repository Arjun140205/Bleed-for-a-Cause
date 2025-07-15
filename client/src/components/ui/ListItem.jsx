import React from "react";

const ListItem = ({ children, className = "" }) => (
  <div className={`flex items-center p-4 border-b border-gray-100 last:border-b-0 ${className}`}>
    {children}
  </div>
);

export default ListItem; 