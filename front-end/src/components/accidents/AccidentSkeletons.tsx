export const AccidentTableSkeleton = () => (
  <div className="bg-[#1E1E1E] rounded-lg overflow-hidden">
    <table className="w-full">
      <thead>
        <tr className="bg-[#252525] text-gray-400 text-sm">
          <th className="px-6 py-4 text-left">Location</th>
          <th className="px-6 py-4 text-left">Time</th>
          <th className="px-6 py-4 text-left">Vehicle ID</th>
          <th className="px-6 py-4 text-left">Speed</th>
          <th className="px-6 py-4 text-left">Severity</th>
          <th className="px-6 py-4 text-right">Action</th>
        </tr>
      </thead>
      <tbody>
        {[...Array(5)].map((_, index) => (
          <tr key={index} className="border-t border-[#2E2E2E] animate-pulse">
            <td className="px-6 py-4">
              <div className="w-24 h-8 bg-gray-600 rounded-md" />
            </td>
            <td className="px-6 py-4">
              <div className="w-48 h-4 bg-gray-600 rounded" />
            </td>
            <td className="px-6 py-4">
              <div className="w-24 h-4 bg-gray-600 rounded" />
            </td>
            <td className="px-6 py-4">
              <div className="w-32 h-4 bg-gray-600 rounded" />
            </td>
            <td className="px-6 py-4">
              <div className="w-20 h-4 bg-gray-600 rounded" />
            </td>
            <td className="px-6 py-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-gray-600" />
                <div className="w-16 h-4 bg-gray-600 rounded" />
              </div>
            </td>
            {/* <td className="px-6 py-4 text-right">
              <div className="w-24 h-8 bg-gray-600 rounded-md ml-auto" />
            </td> */}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);
