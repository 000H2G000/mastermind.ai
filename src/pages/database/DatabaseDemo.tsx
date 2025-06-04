import { Button } from "@/components/ui/button";
import useAxios from "@/hooks/useAxios";
import { useEffect, useState } from "react";

interface Item {
  id: number;
  title: string;
  description?: string;
  is_active: boolean;
  created_at: string;
  updated_at?: string;
}

interface User {
  id: number;
  username: string;
  email: string;
  full_name?: string;
  is_active: boolean;
  created_at: string;
}

const DatabaseDemo = () => {
  const axios = useAxios();
  const [items, setItems] = useState<Item[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [newItemTitle, setNewItemTitle] = useState("");
  const [newUserData, setNewUserData] = useState({
    username: "",
    email: "",
    full_name: ""
  });

  const fetchItems = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/data/items");
      setItems(response.data);
    } catch (error) {
      console.error("Error fetching items:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/users");
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const createItem = async () => {
    if (!newItemTitle.trim()) return;
    
    try {
      await axios.post("/data/items", {
        title: newItemTitle,
        description: "Created from React frontend",
        is_active: true
      });
      setNewItemTitle("");
      fetchItems(); // Refresh the list
    } catch (error) {
      console.error("Error creating item:", error);
    }
  };

  const createUser = async () => {
    if (!newUserData.username.trim() || !newUserData.email.trim()) return;
    
    try {
      await axios.post("/users", newUserData);
      setNewUserData({ username: "", email: "", full_name: "" });
      fetchUsers(); // Refresh the list
    } catch (error) {
      console.error("Error creating user:", error);
    }
  };

  const deleteItem = async (id: number) => {
    try {
      await axios.delete(`/data/items/${id}`);
      fetchItems(); // Refresh the list
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  useEffect(() => {
    fetchItems();
    fetchUsers();
  }, []);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">SQLite Database Demo</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Items Section */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Items</h2>
          
          {/* Create Item Form */}
          <div className="border rounded p-4 space-y-2">
            <h3 className="font-medium">Create New Item</h3>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Item title"
                value={newItemTitle}
                onChange={(e) => setNewItemTitle(e.target.value)}
                className="flex-1 px-3 py-2 border rounded"
              />
              <Button onClick={createItem}>Create</Button>
            </div>
          </div>
          
          {/* Items List */}
          <div className="space-y-2">
            {loading ? (
              <p>Loading items...</p>
            ) : (
              items.map((item) => (
                <div key={item.id} className="border rounded p-3 flex justify-between items-start">
                  <div>
                    <h4 className="font-medium">{item.title}</h4>
                    <p className="text-sm text-gray-600">{item.description}</p>
                    <p className="text-xs text-gray-400">
                      Status: {item.is_active ? "Active" : "Inactive"}
                    </p>
                    <p className="text-xs text-gray-400">
                      Created: {new Date(item.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={() => deleteItem(item.id)}
                  >
                    Delete
                  </Button>
                </div>
              ))
            )}
          </div>
          
          <Button onClick={fetchItems} variant="outline">
            Refresh Items
          </Button>
        </div>

        {/* Users Section */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Users</h2>
          
          {/* Create User Form */}
          <div className="border rounded p-4 space-y-2">
            <h3 className="font-medium">Create New User</h3>
            <input
              type="text"
              placeholder="Username"
              value={newUserData.username}
              onChange={(e) => setNewUserData({...newUserData, username: e.target.value})}
              className="w-full px-3 py-2 border rounded"
            />
            <input
              type="email"
              placeholder="Email"
              value={newUserData.email}
              onChange={(e) => setNewUserData({...newUserData, email: e.target.value})}
              className="w-full px-3 py-2 border rounded"
            />
            <input
              type="text"
              placeholder="Full Name (optional)"
              value={newUserData.full_name}
              onChange={(e) => setNewUserData({...newUserData, full_name: e.target.value})}
              className="w-full px-3 py-2 border rounded"
            />
            <Button onClick={createUser} className="w-full">Create User</Button>
          </div>
          
          {/* Users List */}
          <div className="space-y-2">
            {loading ? (
              <p>Loading users...</p>
            ) : (
              users.map((user) => (
                <div key={user.id} className="border rounded p-3">
                  <h4 className="font-medium">{user.username}</h4>
                  <p className="text-sm text-gray-600">{user.email}</p>
                  {user.full_name && (
                    <p className="text-sm text-gray-600">{user.full_name}</p>
                  )}
                  <p className="text-xs text-gray-400">
                    Status: {user.is_active ? "Active" : "Inactive"}
                  </p>
                  <p className="text-xs text-gray-400">
                    Joined: {new Date(user.created_at).toLocaleDateString()}
                  </p>
                </div>
              ))
            )}
          </div>
          
          <Button onClick={fetchUsers} variant="outline">
            Refresh Users
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DatabaseDemo;
