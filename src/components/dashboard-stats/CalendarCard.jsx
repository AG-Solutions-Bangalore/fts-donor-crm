const CalendarCard = () => {
  const months = ['August', 'September 2024', 'October'];
  const days = [
    { day: 'Mon', date: '22' },
    { day: 'Tue', date: '23' },
    { day: 'Wed', date: '24' },
    { day: 'Thu', date: '25' },
    { day: 'Fri', date: '26' },
    { day: 'Sat', date: '27' },
  ];

  const events = [
    {
      time: '8:00 am',
      title: 'Weekly Team Sync',
      description: 'Discuss progress on projects',
      attendees: 3,
    },
    {
      time: '9:00 am',
      title: '',
      description: '',
      attendees: 0,
    },
    {
      time: '10:00 am',
      title: 'Onboarding Session',
      description: 'Introduction for new hires',
      attendees: 2,
    },
    {
      time: '11:00 am',
      title: '',
      description: '',
      attendees: 0,
    },
  ];

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        {months.map((month, index) => (
          <div
            key={index}
            className={`text-sm ${
              index === 1 ? 'font-semibold text-gray-900' : 'text-gray-400'
            }`}
          >
            {month}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-6 gap-4 mb-6">
        {days.map((day, index) => (
          <div key={index} className="text-center">
            <div className="text-xs text-gray-600 mb-1">{day.day}</div>
            <div className="text-sm font-medium text-gray-900">{day.date}</div>
          </div>
        ))}
      </div>

      <div className="space-y-3">
        {events.map((event, index) => (
          <div key={index} className="flex items-start gap-3">
            <div className="text-xs text-gray-600 w-16">{event.time}</div>
            {event.title ? (
              <div className="flex-1 bg-gray-900 rounded-xl p-3 text-white">
                <div className="text-sm font-medium mb-1">{event.title}</div>
                <div className="text-xs text-gray-300 mb-2">
                  {event.description}
                </div>
                {event.attendees > 0 && (
                  <div className="flex gap-1">
                    {[...Array(event.attendees)].map((_, i) => (
                      <div
                        key={i}
                        className="w-6 h-6 bg-gray-600 rounded-full"
                      />
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="flex-1" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CalendarCard;
