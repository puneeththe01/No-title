import React, { useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import "tailwindcss/tailwind.css";
import { db } from "@/FirebaseCred";
import { Link } from "react-router-dom";

interface User {
  uid: string;
  userName: string;
}

const SearchBar: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSearched(true); // Set searched to true when a search is performed
    try {
      const q = query(
        collection(db, "userData"),
        where("userName", "==", searchQuery)
      );
      const querySnapshot = await getDocs(q);
      const users: User[] = [];
      querySnapshot.forEach((doc) => {
        users.push({ uid: doc.id, ...doc.data() } as User);
      });
      setResults(users);
      console.log(users);
    } catch (error) {
      console.error("Error fetching user data: ", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <form onSubmit={handleSearch} className="flex items-center">
        <input
          type="text"
          placeholder="Search by username"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg w-full"
        />
        <button
          type="submit"
          className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-lg"
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </form>
      <div className="mt-4 bg-gray-100 bg-opacity-75 p-4 rounded-lg">
        {searched && results.length === 0 && (
          <p className="text-gray-600">No results found</p>
        )}
        {results.length > 0 && (
          <ul>
            {results.map((user) => (
              <li key={user.uid} className="p-2 border-b border-gray-300">
                <Link to={"/chatpage"} state={{ username2: user.userName }}>
                  {user.userName}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default SearchBar;
