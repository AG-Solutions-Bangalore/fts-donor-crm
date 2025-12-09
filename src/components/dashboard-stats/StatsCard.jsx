import { Users, TrendingUp, Briefcase } from 'lucide-react';

const StatsCard = () => {
  const stats = [
    { icon: Users, value: '78', label: 'Employe' },
    { icon: TrendingUp, value: '56', label: 'Hirings' },
    { icon: Briefcase, value: '203', label: 'Projects' },
  ];

  return (
    <div className="flex gap-8">
      {stats.map((stat, index) => (
        <div key={index} className="flex items-center gap-3">
          <stat.icon className="w-5 h-5 text-gray-600" />
          <div>
            <div className="text-4xl font-bold text-gray-900">{stat.value}</div>
            <div className="text-sm text-gray-600">{stat.label}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsCard;
