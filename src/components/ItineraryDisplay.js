import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar, MapPin, Camera } from 'lucide-react';

const ItineraryDisplay = ({ itinerary }) => {
  const [currentDayIndex, setCurrentDayIndex] = useState(0);
  const [checkedItems, setCheckedItems] = useState({});

  const currentDay = itinerary.days[currentDayIndex];

  const goToPreviousDay = () => {
    if (currentDayIndex > 0) {
      setCurrentDayIndex(currentDayIndex - 1);
    }
  };

  const goToNextDay = () => {
    if (currentDayIndex < itinerary.days.length - 1) {
      setCurrentDayIndex(currentDayIndex + 1);
    }
  };

  const formatTime = (timeString) => {
    if (!timeString) return '';
    const [hours, minutes] = timeString.split(':');
    return new Date(0, 0, 0, hours, minutes).toLocaleTimeString([], {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    }).replace(/\s/g, '').toLowerCase();
  };

  const handleCheckboxChange = (item) => {
    setCheckedItems(prev => ({ ...prev, [item]: !prev[item] }));
  };

  const getStaticMapUrl = (mapInfo) => {
    const baseUrl = 'https://maps.googleapis.com/maps/api/staticmap';
    const params = new URLSearchParams({
      center: `${mapInfo.latitude},${mapInfo.longitude}`,
      zoom: mapInfo.zoomLevel,
      size: '600x300',
      scale: 2, // For higher resolution
      maptype: 'roadmap',
      key: 'AIzaSyBKw49yTlitP8IPTQw2UKgppDsfy9ifDjE'
    });
    return `${baseUrl}?${params.toString()}`;
  };

  const renderDay = (day, index) => (
    <div key={index} className="mb-8 page-break-before">
      <h2 className="text-2xl font-semibold mb-4 print-only">{day.title}</h2>

      {day.mapInfo && (
        <div className="mb-4 bg-gray-200 rounded-lg overflow-hidden">
          <img
            src={getStaticMapUrl(day.mapInfo)}
            alt={`Map for ${day.title}`}
            className="w-full h-auto"
          />
        </div>
      )}

      <div className="mb-4">
        <h3 className="text-xl font-semibold mb-2 flex items-center"><Calendar className="mr-2" /> Activities</h3>
        <ul className="space-y-2">
          {day.activities.map((activity, actIndex) => (
            <li key={actIndex} className="flex items-start">
              <span className="font-semibold text-blue-600 w-40 flex-shrink-0 text-right pr-2">
                {formatTime(activity.time)}
                {activity.endTime && `-${formatTime(activity.endTime)}`}
              </span>
              <span className="flex-grow">{activity.description}</span>
            </li>
          ))}
        </ul>
      </div>

      {day.wildlifeChecklist && (
        <div className="mb-4">
          <h3 className="text-xl font-semibold mb-2">Wildlife Checklist</h3>
          <ul className="space-y-1">
            {day.wildlifeChecklist.map((item, checkIndex) => (
              <li key={checkIndex} className="flex items-center">
                <input
                  type="checkbox"
                  id={`checkbox-${index}-${checkIndex}`}
                  checked={checkedItems[item] || false}
                  onChange={() => handleCheckboxChange(item)}
                  className="mr-2"
                />
                <label htmlFor={`checkbox-${index}-${checkIndex}`}>{item}</label>
              </li>
            ))}
          </ul>
        </div>
      )}

      {day.photographyTip && (
        <div className="mb-4 bg-yellow-50 p-4 rounded-lg">
          <h3 className="text-xl font-semibold mb-2 flex items-center"><Camera className="mr-2" /> Photography Tip</h3>
          <p>{day.photographyTip}</p>
        </div>
      )}
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto p-4 bg-white shadow-lg rounded-lg">
      <h1 className="text-3xl font-bold mb-4 text-center screen-only">{itinerary.title}</h1>

      <div className="mb-4 flex flex-row items-center justify-between screen-only w-full" style={{ display: 'flex' }}>
        <button
          onClick={goToPreviousDay}
          className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors duration-200"
          disabled={currentDayIndex === 0}
          style={{ flexShrink: 0 }}
        >
          <ChevronLeft size={24} />
        </button>
        <h2 className="text-2xl font-semibold mx-4 text-center" style={{ flexGrow: 1 }}>
          {currentDay.title}
        </h2>
        <button
          onClick={goToNextDay}
          className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors duration-200"
          disabled={currentDayIndex === itinerary.days.length - 1}
          style={{ flexShrink: 0 }}
        >
          <ChevronRight size={24} />
        </button>
      </div>

      <div className="screen-only">
        {renderDay(currentDay, currentDayIndex)}
      </div>

      <div className="print-only">
        {itinerary.days.map((day, index) => renderDay(day, index))}
      </div>

      <style>{`
        @media print {
          body { margin: 0; padding: 0; }
          .max-w-3xl { max-width: none; }
          .screen-only { display: none !important; }
          .print-only { display: block !important; }
          .page-break-before { page-break-before: always; }
          h1 { page-break-after: avoid; }
          @page { size: auto; margin: 20mm; }
          @page :first { margin-top: 0; }
        }
        @media screen {
          .screen-only { display: block; }
          .print-only { display: none; }
        }
      `}</style>
    </div>
  );
};

export default ItineraryDisplay;