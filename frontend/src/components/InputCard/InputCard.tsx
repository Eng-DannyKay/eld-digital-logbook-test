import React from "react";


type InputCardProps = {
  title: React.ReactNode;
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
};

const InputCard: React.FC<InputCardProps> = ({ title, icon: Icon, children }) => (
  <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow">
    <div className="flex items-center space-x-2 mb-4">
      <Icon className="w-5 h-5 text-primary" />
      <h3 className="text-lg font-semibold text-secondary">{title}</h3>
    </div>
    {children}
  </div>
);

export default InputCard;