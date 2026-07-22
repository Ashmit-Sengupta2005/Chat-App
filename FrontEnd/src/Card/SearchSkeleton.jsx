const SearchSkeleton = ({ sidebarWidth }) => {
  // Create 3 skeleton items to simulate loading search results
  const skeletonContacts = Array(3).fill(null);

  return (
    <div className="w-full flex flex-col py-2">
      {skeletonContacts.map((_, idx) => (
        <div key={idx} className="w-full p-3 flex items-center gap-3">
          {/* Avatar skeleton */}
          <div className={`relative ${sidebarWidth < 120 ? "mx-auto" : "mx-0"}`}>
            <div className="skeleton bg-base-300 w-12 h-12 rounded-full shrink-0" />
          </div>

          {/* User info skeleton */}
          <div className={`${sidebarWidth < 120 ? "hidden" : "block"} text-left min-w-0 flex-1`}>
            <div className="skeleton bg-base-300 h-4 w-24 mb-2 rounded" />
            <div className="skeleton bg-base-300 h-3 w-16 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default SearchSkeleton;
