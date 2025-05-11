export const GridSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
    {[...Array(8)].map((_, index) => (
      <div
        key={index}
        className="bg-[#1E1E1E] rounded-lg p-6 hover:bg-[#252525] transition-colors animate-pulse"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-gray-600" />
            <div className="h-4 w-16 bg-gray-600 rounded" />
          </div>
          <div className="h-4 w-20 bg-gray-600 rounded" />
        </div>

        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-gray-600" />
          <div className="space-y-2">
            <div className="h-5 w-32 bg-gray-600 rounded" />
            <div className="h-4 w-24 bg-gray-600 rounded" />
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="h-4 w-full bg-gray-600 rounded" />
          </div>
          <div className="flex items-center gap-2">
            <div className="h-4 w-full bg-gray-600 rounded" />
          </div>
        </div>

        <div className="flex gap-2 mt-6">
          <div className="flex-1 h-8 bg-gray-600 rounded-md" />
          <div className="flex-1 h-8 bg-gray-600 rounded-md" />
        </div>
      </div>
    ))}
  </div>
);

export const ListSkeleton = () => (
  <div className="bg-[#1E1E1E] rounded-lg">
    <table className="w-full">
      <thead>
        <tr className="bg-[#252525] text-gray-400 text-sm">
          <th className="px-6 py-4 text-left">Status</th>
          <th className="px-6 py-4 text-left">Vehicle</th>
          <th className="px-6 py-4 text-left">Driver</th>
          <th className="px-6 py-4 text-left">Speed</th>
          <th className="px-6 py-4 text-left">Location</th>
          <th className="px-6 py-4 text-right">Actions</th>
        </tr>
      </thead>
      <tbody>
        {[...Array(5)].map((_, index) => (
          <tr key={index} className="border-t border-[#2E2E2E] animate-pulse">
            <td className="px-6 py-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-gray-600" />
                <div className="h-4 w-16 bg-gray-600 rounded" />
              </div>
            </td>
            <td className="px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-600" />
                <div className="space-y-2">
                  <div className="h-4 w-32 bg-gray-600 rounded" />
                  <div className="h-3 w-24 bg-gray-600 rounded" />
                </div>
              </div>
            </td>
            <td className="px-6 py-4">
              <div className="h-4 w-24 bg-gray-600 rounded" />
            </td>
            <td className="px-6 py-4">
              <div className="h-4 w-20 bg-gray-600 rounded" />
            </td>
            <td className="px-6 py-4">
              <div className="h-4 w-36 bg-gray-600 rounded" />
            </td>
            <td className="px-6 py-4 text-right">
              <div className="flex items-center justify-end gap-2">
                <div className="h-8 w-20 bg-gray-600 rounded-md" />
                <div className="h-8 w-20 bg-gray-600 rounded-md" />
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);
