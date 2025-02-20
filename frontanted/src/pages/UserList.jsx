import { useEffect, useState } from "react";
import { fetchUsers } from "./FetchUsers";

export default function UserList({ setSelectedUser }) {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const data = await fetchUsers();
        setUsers(data);
      } catch (error) {
        setError("Failed to fetch users");
      }
    };
    loadUsers();
  }, []);

  if (error) {
    return <p className="text-red-500 text-center">{error}</p>;
  }

  return (
    <div className="w-full h-full max-w-md mx-auto mt-4">
      <h2 className="text-2xl font-bold text-center mb-4 text-gray-800">Users List</h2>
      
      {/* Scrollable User List */}
      <div className="h-[60vh] md:h-[80vh] overflow-y-auto space-y-3 p-2 border rounded-lg shadow-md bg-white">
        {users.length > 0 ? (
          users.map((user) => (
            <button
              key={user._id} 
              className="w-full flex items-center gap-4 p-3 border rounded-lg hover:bg-gray-100 transition"
              onClick={() => setSelectedUser(user)}
            >
              <img
                className="w-10 h-10 rounded-full object-cover"
                src={user.profilePicture || "https://via.placeholder.com/64"}
                alt={user.name}
              />
              <span className="text-lg font-semibold">{user.name}</span>
            </button>
          ))
        ) : (
          <p className="text-center text-gray-500">No users found</p>
        )}
      </div>
    </div>
  );
}
