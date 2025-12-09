const OnboardingCard = () => {
  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Onboarding</h3>
        <div className="text-2xl font-bold text-gray-900">18%</div>
      </div>

      <div className="flex gap-2 mb-2">
        <div className="flex-1">
          <div className="text-xs text-gray-600 mb-1">30%</div>
          <div className="h-2 bg-yellow-400 rounded-full"></div>
          <div className="text-xs text-gray-900 mt-1">Task</div>
        </div>
        <div className="flex-1">
          <div className="text-xs text-gray-600 mb-1">25%</div>
          <div className="h-2 bg-gray-900 rounded-full"></div>
        </div>
        <div className="flex-1">
          <div className="text-xs text-gray-600 mb-1">0%</div>
          <div className="h-2 bg-gray-300 rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingCard;
