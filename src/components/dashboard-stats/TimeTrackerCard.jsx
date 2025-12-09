import { ArrowUpRight, Play, Pause } from 'lucide-react';

const TimeTrackerCard = () => {
  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm">
      <div className="flex items-start justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Time tracker</h3>
        <button className="p-2 hover:bg-gray-50 rounded-lg transition-colors">
          <ArrowUpRight className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      <div className="flex items-center justify-center mb-6">
        <div className="relative w-48 h-48">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="96"
              cy="96"
              r="88"
              fill="none"
              stroke="#f3f4f6"
              strokeWidth="12"
            />
            <circle
              cx="96"
              cy="96"
              r="88"
              fill="none"
              stroke="#fbbf24"
              strokeWidth="12"
              strokeDasharray={`${2 * Math.PI * 88 * 0.75} ${2 * Math.PI * 88}`}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-4xl font-bold text-gray-900">02:35</div>
            <div className="text-sm text-gray-600">Work Time</div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center gap-4">
        <button className="p-3 hover:bg-gray-50 rounded-lg transition-colors">
          <Play className="w-5 h-5 text-gray-700" fill="currentColor" />
        </button>
        <button className="p-3 hover:bg-gray-50 rounded-lg transition-colors">
          <Pause className="w-5 h-5 text-gray-700" />
        </button>
        <button className="p-3 bg-gray-900 hover:bg-gray-800 rounded-lg transition-colors">
          <svg
            className="w-5 h-5 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default TimeTrackerCard;
