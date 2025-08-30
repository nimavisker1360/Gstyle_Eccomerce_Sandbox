"use client";

export default function SignupLoading() {
  return (
    <div className="w-full bg-white">
      {/* Beautiful Loading Animation */}
      <div className="flex flex-col items-center justify-center py-8 mb-6">
        <div className="relative">
          {/* Main loading spinner */}
          <div className="w-12 h-12 border-4 border-green-100 border-t-4 border-t-green-500 rounded-full animate-spin"></div>

          {/* Inner spinner */}
          <div
            className="absolute top-1.5 left-1.5 w-9 h-9 border-4 border-blue-100 border-t-4 border-t-blue-500 rounded-full animate-spin"
            style={{
              animationDirection: "reverse",
              animationDuration: "1.5s",
            }}
          ></div>
        </div>

        {/* Loading text with typewriter effect */}
        <div className="mt-4 text-center">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            در حال ایجاد حساب کاربری...
          </h3>
          <div className="flex justify-center items-center space-x-1 rtl:space-x-reverse">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-bounce"></div>
            <div
              className="w-1.5 h-1.5 bg-green-500 rounded-full animate-bounce"
              style={{ animationDelay: "0.1s" }}
            ></div>
            <div
              className="w-1.5 h-1.5 bg-green-500 rounded-full animate-bounce"
              style={{ animationDelay: "0.2s" }}
            ></div>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            لطفاً صبر کنید، حساب کاربری شما در حال ایجاد است...
          </p>
        </div>
      </div>
    </div>
  );
}
