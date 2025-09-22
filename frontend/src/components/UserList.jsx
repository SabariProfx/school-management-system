function UserList({ title, users, onDelete }) {
  return (
    <div>
      <h2>{title}</h2>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            <span>{user.name}</span>
            <button onClick={() => onDelete(user.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default UserList;