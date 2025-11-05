const SectionHeader = ({
  icon,
  title,
}: {
  icon: React.ReactNode;
  title: string;
}) => (
  <div className="flex items-center gap-3 mb-5 pb-3 border-b border-gray-200">
    {icon}
    <h3 className="text-xl font-bold text-gray-800">{title}</h3>
  </div>
);

export default SectionHeader;
