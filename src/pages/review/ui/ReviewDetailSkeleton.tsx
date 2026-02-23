export const ReviewDetailSkeleton = () => {
  return (
    <div className="flex flex-col bg-gray-50 min-h-[calc(100vh-56px)]">
      <div className="px-5 pt-4">
        <div className="flex flex-col gap-5 bg-white rounded-[20px] p-5">
          <div className="flex flex-col gap-2">
            <div className="w-24 h-4 bg-gray-100 rounded-full animate-pulse" />
            <div className="w-48 h-6 bg-gray-100 rounded-full animate-pulse" />
            <div className="flex items-center gap-2">
              <div className="w-20 h-3 bg-gray-100 rounded-full animate-pulse" />
              <div className="w-20 h-3 bg-gray-100 rounded-full animate-pulse" />
              <div className="w-20 h-3 bg-gray-100 rounded-full animate-pulse" />
            </div>
          </div>
          <div className="w-32 h-4 bg-gray-100 rounded-full animate-pulse" />
        </div>
      </div>

      <div className="px-5 py-6">
        <div className="flex gap-1.5">
          <div className="w-16 h-5 bg-gray-100 rounded-full animate-pulse" />
          <div className="w-16 h-5 bg-gray-100 rounded-full animate-pulse" />
          <div className="w-16 h-5 bg-gray-100 rounded-full animate-pulse" />
        </div>
      </div>

      <div className="px-5 flex flex-col gap-3">
        <div className="w-24 h-4 bg-gray-100 rounded-full animate-pulse" />
        <div className="flex flex-col gap-2">
          {Array(4)
            .fill(null)
            .map((_, index) => (
              <div key={index} className="flex justify-between items-center">
                <div className="w-32 h-4 bg-gray-100 rounded-full animate-pulse" />
                <div className="w-16 h-4 bg-gray-100 rounded-full animate-pulse" />
              </div>
            ))}
        </div>
      </div>

      <div className="w-full h-px bg-gray-100 my-6" />

      <div className="px-5 flex flex-col gap-3">
        <div className="w-24 h-4 bg-gray-100 rounded-full animate-pulse" />
        <div className="w-full h-20 bg-gray-100 rounded-lg animate-pulse" />
      </div>

      <div className="w-full h-px bg-gray-100 my-6" />

      <div className="px-5 flex flex-col gap-3">
        <div className="w-24 h-4 bg-gray-100 rounded-full animate-pulse" />
        <div className="flex gap-2 overflow-x-auto no-scrollbar touch-pan-x">
          {Array(8)
            .fill(null)
            .map((_, index) => (
              <div key={index} className="shrink-0 w-20 h-20 bg-gray-100 rounded-lg animate-pulse" />
            ))}
        </div>
      </div>
    </div>
  );
};
