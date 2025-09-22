function UserList({ title, users, onDelete }) {
  return (
    <div>
      <h2>{title}</h2>
      <ul>
        {users.map((user, index) => (
          <li key={index}>
            <span>{user}</span>
            <button onClick={() => onDelete(user)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default UserList;