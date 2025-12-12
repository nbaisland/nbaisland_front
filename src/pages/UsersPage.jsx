import { useState, useEffect, useMemo } from "react";
import UserCard from "../components/User/UserCard";
import { getUsers } from "../api";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState("name");
  const [sortDir, setSortDir] = useState("asc");

  useEffect(() => {
    async function loadUsers() {
      const data = await getUsers();
      setUsers(data);
    }
    loadUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    let res = users;

    if (search) {
      const s = search.toLowerCase();
      res = res.filter(u =>
        u.name.toLowerCase().includes(s) ||
        (u.username && u.username.toLowerCase().includes(s))
      );
    }

    res = [...res].sort((a, b) => {
      const dir = sortDir === "desc" ? -1 : 1;
      if (a[sortKey] > b[sortKey]) return dir;
      if (a[sortKey] < b[sortKey]) return -dir;
      return 0;
    });

    return res;
  }, [users, search, sortKey, sortDir]);

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <h1>Users</h1>

      <div style={{ display: "flex", gap: "12px", marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Search users..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ flex: 1, padding: "8px" }}
        />

        <select value={sortKey} onChange={e => setSortKey(e.target.value)}>
          <option value="name">Name</option>
          <option value="username">Username</option>
          <option value="score">Score</option>
        </select>

        <select value={sortDir} onChange={e => setSortDir(e.target.value)}>
          <option value="asc">Asc</option>
          <option value="desc">Desc</option>
        </select>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {filteredUsers.map(user => (
          <UserCard key={user.id} user={user} />
        ))}
      </div>
    </div>
  );
}
