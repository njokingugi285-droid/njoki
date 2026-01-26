
import React from 'react';

const EmergencyStrip: React.FC = () => {
  return (
    <div className="bg-rose-600 text-white py-3 px-4 text-center sticky bottom-0 z-50 shadow-lg flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-6">
      <span className="font-bold flex items-center gap-2">
        <i className="fas fa-phone-alt animate-pulse"></i>
        MEDICAL EMERGENCY?
      </span>
      <div className="flex gap-4 text-sm font-medium">
        <a href="tel:119" className="hover:underline bg-rose-700 px-3 py-1 rounded">Call 119 (Kenya)</a>
        <a href="https://www.google.com/maps/search/nearest+emergency+room" target="_blank" rel="noopener noreferrer" className="hover:underline bg-rose-700 px-3 py-1 rounded">Find Nearest ER</a>
      </div>
    </div>
  );
};

export default EmergencyStrip;
