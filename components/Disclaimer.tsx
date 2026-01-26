
import React from 'react';

const Disclaimer: React.FC = () => {
  return (
    <div className="bg-amber-50 border-l-4 border-amber-500 p-4 mb-6 rounded-r shadow-sm">
      <div className="flex">
        <div className="flex-shrink-0">
          <i className="fas fa-exclamation-triangle text-amber-500"></i>
        </div>
        <div className="ml-3">
          <p className="text-sm text-amber-800 font-medium">
            Medical & Mental Health Disclaimer
          </p>
          <div className="text-xs text-amber-700 mt-1 space-y-1">
            <p>
              This assistant is for informational purposes only. This is <strong>non-diagnostic</strong> and I am <strong>not a medical professional</strong>.
            </p>
            <p>
              Additionally, <strong>I am not a mental health assistant</strong>. This tool is not designed to provide support for psychological crises, mental health conditions, or emotional distress.
            </p>
            <p className="pt-1">
              Information provided should not be considered medical advice or a substitute for professional clinical judgment. 
              If you are experiencing a medical or mental health emergency, please call your local emergency services (e.g., 119) or a crisis hotline immediately.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Disclaimer;
