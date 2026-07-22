import SidebarSkeleton from "../Card/SidebarSkeleton.jsx"
import SearchSkeleton from "../Card/SearchSkeleton.jsx";
import { useChatStore } from "../Store/UseChatStore";
import { useAuthStore } from "../Store/UseAuthStore.js";
import { useEffect,useState,useRef} from "react";
import { Users, Search, MessageSquare, X } from "lucide-react";

const Sidebar = () => {
  const {getUsers,users,setSelectedUser,isUsersLoading,selectedUser,isSearchingUser,searchUser,searchUsersArray}=useChatStore();
  const [sidebarWidth,setSidebarWidth]=useState(288);
  const [showOnlineOnly,setShowOnlineOnly] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const sidebarRef=useRef(null);
  const {authUser,onlineUsers}=useAuthStore();
  const [searchText,setSearchText]=useState("");
  const handleSearch=async(e)=>{
    const text=e.target.value;
    setSearchText(e.target.value);
    if(text.trim()===""){
      getUsers();}
    else{
      await searchUser(text);}}
    const handleSelectUser = (user) => {
    setSelectedUser(user);
    setSearchText("");};

  const clearSearch = () => {
    setSearchText("");
    getUsers();
  };

  useEffect(()=>{
    getUsers()},[getUsers]);
  useEffect(()=>{
    const handleMouseMove=(e)=>{
      if(!isResizing||!sidebarRef.current) return;
      const sidebarRect=sidebarRef.current.getBoundingClientRect();
      const newWidth=e.clientX-sidebarRect.left;
      if(newWidth>=80&& newWidth<=500) setSidebarWidth(newWidth);
    };
    const handleMouseUp=()=>setIsResizing(false);
    if(isResizing){
      document.addEventListener("mousemove",handleMouseMove);
       document.addEventListener("mouseup", handleMouseUp);
    }
    return ()=>{
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    }
  },[isResizing])
 if(isUsersLoading ) return <SidebarSkeleton/>;
let displayList = searchText.trim() === "" ? users : (searchUsersArray || []);
if(searchText.trim()===""&&selectedUser&&!users.some(u=>u._id===selectedUser._id)){
  displayList=[selectedUser,...displayList];
}
const checkIsOnline = (user) => onlineUsers.includes(user._id) || user._id === "000000000000000000000000";
const filteredUsers=showOnlineOnly?displayList.filter(checkIsOnline):displayList;
  return (
    <aside style={{width:sidebarWidth}} ref={sidebarRef}
    className="h-full border-r border-white/20 flex flex-col relative flex-shrink-0">
      
      {/* Header Section */}
      <div className="border-b border-white/20 w-full p-5">
        <div className="flex items-center gap-2">
          <Users className="w-6 h-6" />
          <span className={`font-medium ${sidebarWidth < 120 ? "hidden" : "block"}`}>Contacts</span>
        </div>
        
        {/* Online Toggle (Hidden on mobile) */}
        <div className={`mt-3 ${sidebarWidth < 120 ? "hidden" : "flex"} items-center gap-2`}>
          <label className="cursor-pointer flex items-center gap-2">
            <input 
              type="checkbox" 
              onChange={(e)=>setShowOnlineOnly(e.target.checked)}
              className="checkbox checkbox-sm" 
              defaultChecked={showOnlineOnly} 
            />
            <span className="text-sm">Show online only</span>
          </label>
          <span className="text-xs text-base-content/50">
            ({onlineUsers.length} online)
          </span>
        </div>

        {/* Search Bar UI (Hidden on collapsed view) */}
        <div className={`mt-4 ${sidebarWidth < 120 ? "hidden" : "block"}`}>
          <div className="relative flex items-center group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-white/50 group-focus-within:text-primary transition-colors" />
            </div>
            <input
              type="text"
              placeholder="Search users..."
              value={searchText}
              onChange={handleSearch}
              className="w-full pl-10 pr-10 py-2.5 bg-white/5 hover:bg-white/10 focus:bg-white/10 border border-white/20 focus:border-primary/50 rounded-xl text-sm text-white focus:outline-none focus:ring-4 focus:ring-primary/20 transition-all duration-300 placeholder-white/40 shadow-sm"
            />
            {searchText && (
              <button
                onClick={clearSearch}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-white/40 hover:text-white transition-colors cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Contacts List */}
      <div className="overflow-y-auto w-full py-3">
        {isSearchingUser ? (
          <SearchSkeleton sidebarWidth={sidebarWidth} />
        ) : filteredUsers.length === 0 && searchText.trim() !== "" ? (
          <div className="text-center p-5 text-base-content/50 text-sm">
            No users found matching "{searchText}"
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="text-center p-5 text-base-content/50 text-sm">
            No contacts available
          </div>
        ) : (
          filteredUsers.map((user) => (
          <button
            key={user._id}
            onClick={()=>handleSelectUser(user)}
            type="button"
            className={`w-full p-3 flex items-center gap-3 hover:bg-white/5 transition-all group
              ${selectedUser?._id === user._id ? "bg-white/10 ring-1 ring-white/20" : ""}
            `}
          >
            {/* Avatar container */}
            <div className={`relative ${sidebarWidth < 120 ? "mx-auto" : "mx-0"}`}>
              <img
                src={user.profilePicture || `https://ui-avatars.com/api/?name=${user.username}&background=random`} 
                alt={user.username}
                className="w-12 h-12 object-cover rounded-full"
              />
              {/* Online Indicator Dot */}
              {checkIsOnline(user) && (
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full ring-2 ring-base-100" />
              )}
            </div>

            {/* User Info (Hidden on mobile) */}
            <div className={`${sidebarWidth < 120 ? "hidden" : "block"} text-left flex-1 min-w-0`}>
              <div className="font-medium truncate">
                {user._id===authUser._id?`${user.username} (You)`:user.username}</div>
              <div className="text-sm text-base-content/60">
                {checkIsOnline(user) ? "Online" : "Offline"}
              </div>
            </div>

            {/* Right Side: Timestamp, Badge, and Hover Icon (Hidden on mobile) */}
            <div className={`flex items-center gap-2 ${sidebarWidth < 120 ? "hidden" : "flex"}`}>
              {/* Time and Unread Badge Column */}
              <div className="flex flex-col items-end justify-center min-w-[40px]">
                {user.lastMessageTime && (
                  <div className={`text-xs whitespace-nowrap mb-0.5 ${user.unreadMessages > 0 ? "text-blue-500 font-medium" : "text-base-content/50"}`}>
                    {new Date(user.lastMessageTime).toLocaleTimeString([], { 
                      hour: 'numeric', 
                      minute: '2-digit' 
                    })}
                  </div>
                )}
                {user.unreadMessages > 0 && (
                  <div className="bg-blue-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center shadow-sm">
                    {user.unreadMessages}
                  </div>
                )}
              </div>

              {/* Quick Message Icon (Appears on hover, or ALWAYS if searching) */}
              <div className={`
                flex items-center justify-center h-8 rounded-full bg-primary/10 text-primary transition-all duration-300
                ${searchText.trim() !== "" ? "opacity-100 scale-100 w-8" : "opacity-0 w-0 group-hover:opacity-100 group-hover:w-8 group-hover:scale-100 overflow-hidden"}
              `}>
                <MessageSquare className="w-4 h-4 shrink-0" />
              </div>
            </div>
          </button>
        )))}
      </div>

      {/* Resizer Handle */}
      <div onMouseDown={(e) => { e.preventDefault(); setIsResizing(true);}}
       className="absolute top-0 right-0 w-1.5 h-full cursor-col-resize z-10" />
    </aside>
  );
}

export default Sidebar