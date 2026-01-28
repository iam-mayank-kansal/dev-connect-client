import React from 'react';

// A simple, centered loader for Devconnect.
const DevconnectLoader = () => {
  return (
    <>
      {/* Main container: A fixed-position overlay to center the loader on the page.
        The background is transparent so it doesn't feel intrusive.
      */}
      <div
        className=" h-full w-full z-50 flex flex-col items-center justify-center"
        role="status"
        aria-live="polite"
      >
        <div className="flex flex-col items-center justify-center -translate-y-16">
          {/* A classic spinner using Tailwind CSS utilities */}
          <div
            className="w-12 h-12 translate- rounded-full animate-spin border-4 border-solid border-purple-500 border-t-transparent"
            aria-hidden="true"
          ></div>

          <p className="mt-4 text-base text-gray-400">Loading...</p>
          <span className="sr-only">Content is loading</span>
        </div>
      </div>
    </>
  );
};

export default DevconnectLoader;
