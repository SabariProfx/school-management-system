function UserList({ title, users }) {
  return (
    <div>
      <h2>{title}</h2>
      <ul>
        {users.map((user, index) => (
          <li key={index}>{user}</li>
        ))}
      </ul>
    </div>
  );
}

export default UserList;