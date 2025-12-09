import { Video, Zap, FileText, PenTool, Briefcase } from 'lucide-react';

const OnboardingTaskCard = () => {
  const tasks = [
    {
      icon: Video,
      title: 'Interview',
      time: 'Sep 13, 09:00',
      completed: true,
    },
    {
      icon: Zap,
      title: 'Team Meeting',
      time: 'Sep 13, 10:30',
      completed: true,
    },
    {
      icon: FileText,
      title: 'Project Update',
      time: 'Sep 13, 13:00',
      completed: false,
    },
    {
      icon: PenTool,
      title: 'Discuss Q3 Goals',
      time: 'Sep 13, 14:45',
      completed: false,
    },
    {
      icon: Briefcase,
      title: 'HR Policy Review',
      time: 'Sep 13, 16:30',
      completed: false,
    },
  ];

  return (
    <div className="bg-gray-900 rounded-3xl p-6 shadow-sm text-white">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">Onboarding Task</h3>
        <div className="text-2xl font-bold">2/8</div>
      </div>

      <div className="space-y-3">
        {tasks.map((task, index) => (
          <div
            key={index}
            className="flex items-center gap-3 p-3 bg-gray-800 rounded-xl hover:bg-gray-700 transition-colors"
          >
            <div className="p-2 bg-gray-700 rounded-lg">
              <task.icon className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium">{task.title}</div>
              <div className="text-xs text-gray-400">{task.time}</div>
            </div>
            {task.completed && (
              <div className="w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-gray-900"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default OnboardingTaskCard;
