import React from 'react';

const SuccessPopUp = ({ message, onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
      <div className="bg-white p-4 rounded-lg shadow-lg w-full max-w-[230px] xs:max-w-[280px] sm:max-w-[320px] md:max-w-[400px] lg:max-w-[500px]">
        <h2 className="text-lg xs:text-xl sm:text-2xl md:text-3xl font-semibold text-green-600 text-center">Success!</h2>
        <p className="text-xs xs:text-sm text-gray-700 mt-4 text-center">{message}</p>
        <div className="mt-6 flex justify-center">
          <button
            onClick={onClose}
            className="px-4 py-2 xs:px-6 xs:py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuccessPopUp;
