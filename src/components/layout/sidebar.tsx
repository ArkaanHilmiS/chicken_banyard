export default function Sidebar() {
  return (
    <aside className="bg-gray-100 w-48 h-full p-4">
      <ul>
        <li><a href="/dashboard">Dashboard</a></li>
        <li><a href="/order">Order</a></li>
        <li><a href="/payment">Payment</a></li>
        <li><a href="/stock">Stock</a></li>
        <li><a href="/journal">Journal</a></li>
        <li><a href="/report">Report</a></li>
      </ul>
    </aside>
  );
}
