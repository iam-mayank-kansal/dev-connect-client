import React from 'react';

const SectionCard = ({ children }: { children: React.ReactNode }) => (
  <div className="bg-white rounded-lg shadow-sm p-6 md:p-8">{children}</div>
);

export default SectionCard;
