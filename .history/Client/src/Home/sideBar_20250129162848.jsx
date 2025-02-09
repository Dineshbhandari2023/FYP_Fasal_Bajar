const Sidebar = ({ user }) => {
  return (
    <nav className="bg-green-800 text-white w-64 p-4 flex flex-col gap-4">
      <div className="text-center">
        <h2 className="text-xl font-bold">FarmConnect</h2>
        <p>{user.role}</p>
      </div>
      <ul className="flex flex-col gap-2">
        <li className="hover:bg-green-600 p-2 rounded">
          <a href="#">Home</a>
        </li>
        <li className="hover:bg-green-600 p-2 rounded">
          <a href="#">Browse Products</a>
        </li>
        <li className="hover:bg-green-600 p-2 rounded">
          <a href="#">Order History</a>
        </li>
        <li className="hover:bg-green-600 p-2 rounded">
          <a href="#">Messages</a>
        </li>
        <li className="hover:bg-green-600 p-2 rounded">
          <a href="#">Settings</a>
        </li>
      </ul>
    </nav>
  );
};

export default Sidebar;
