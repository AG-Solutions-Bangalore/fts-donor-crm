import { ChevronDown, ChevronUp } from 'lucide-react';

const ProfileCard = () => {
  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm h-full flex flex-col">
      <div className="relative mb-6">
        <img
          src="https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=600"
          alt="Lora Piterson"
          className="w-full h-48 object-cover rounded-2xl"
        />
        <div className="absolute bottom-4 left-4 text-white">
          <div className="font-semibold text-lg">Lora Piterson</div>
          <div className="text-sm opacity-90">UX/UI Designer</div>
        </div>
        <div className="absolute bottom-4 right-4 bg-gray-800/70 backdrop-blur-sm px-4 py-1 rounded-full text-white text-sm">
          $1,200
        </div>
      </div>

      <div className="space-y-2 flex-1">
        <button className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
          <span className="text-sm font-medium text-gray-900">Pension contributions</span>
          <ChevronDown className="w-4 h-4 text-gray-600" />
        </button>

        <button className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
          <span className="text-sm font-medium text-gray-900">Devices</span>
          <ChevronUp className="w-4 h-4 text-gray-600" />
        </button>

        <div className="bg-gray-50 rounded-lg p-3">
          <div className="flex items-center gap-3 mb-2">
            <img
              src="https://images.pexels.com/photos/18105/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=100"
              alt="MacBook Air"
              className="w-12 h-12 object-cover rounded-lg"
            />
            <div className="flex-1">
              <div className="text-sm font-medium text-gray-900">MacBook Air</div>
              <div className="text-xs text-gray-600">Version M1</div>
            </div>
            <button className="p-1">
              <span className="text-gray-600">⋮</span>
            </button>
          </div>
        </div>

        <button className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
          <span className="text-sm font-medium text-gray-900">Compensation Summary</span>
          <ChevronDown className="w-4 h-4 text-gray-600" />
        </button>

        <button className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
          <span className="text-sm font-medium text-gray-900">Employee Benefits</span>
          <ChevronDown className="w-4 h-4 text-gray-600" />
        </button>
      </div>
    </div>
  );
};

export default ProfileCard;
