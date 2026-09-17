export default function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="bg-primary shadow-sm">
      <div className="mx-auto flex w-full max-w-screen-xl items-center p-2">
        <span className="w-full text-center text-sm text-white">
          © {currentYear} <span className="font-semibold">Saptha Syntara</span>. All
          Rights Reserved.
        </span>
      </div>
    </footer>
  );
}
