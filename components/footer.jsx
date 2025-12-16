export default function Footer() {
  return (
    <footer className="mt-12 pt-10 pb-15 border-t border-gray-800/30">
      <div className="text-center text-sm text-gray-500">
        <p>© {new Date().getFullYear()} EdiAud. All rights reserved.</p>
      </div>
    </footer>
  );
}