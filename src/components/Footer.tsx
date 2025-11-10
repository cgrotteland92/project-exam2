export default function Footer() {
  return (
    <footer className="bg-gray-100 text-gray-600 py-6 mt-10">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between text-sm">
        <p>© {new Date().getFullYear()} Holidaze. All rights reserved.</p>
      </div>
    </footer>
  );
}
