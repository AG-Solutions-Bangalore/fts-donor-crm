import { ArrowUpRight } from 'lucide-react';

const ProgressCard = () => {
  const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  const barHeights = [30, 50, 70, 60, 100, 40, 20];

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">Progress</h3>
          <div className="text-3xl font-bold text-gray-900">6.1h</div>
          <div className="text-sm text-gray-600">Work Time</div>
          <div className="text-xs text-gray-500">this week</div>
        </div>
        <button className="p-2 hover:bg-gray-50 rounded-lg transition-colors">
          <ArrowUpRight className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      <div className="flex items-end justify-between h-32 mb-2">
        {barHeights.map((height, index) => (
          <div key={index} className="flex flex-col items-center gap-2 flex-1">
            <div className="relative w-full max-w-[30px]">
              <div
                className={`w-full rounded-full transition-all ${
                  index === 4 ? 'bg-yellow-400' : 'bg-gray-900'
                }`}
                style={{ height: `${height}px` }}
              />
              {index === 4 && (
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-yellow-400 text-gray-900 text-xs px-2 py-1 rounded-full whitespace-nowrap">
                  5h 25m
                </div>
              )}
            </div>
            <span className="text-xs text-gray-600">{days[index]}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProgressCard;
