import SearchField from "@/components/SearchField";
import UserButton from "@/components/UserButton";
import Link from "next/link";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-10 bg-card shadow-sm">
      <div className="max-w-7x mx-auto flex flex-wrap items-center justify-center gap-5 px-5 py-5">
        <Link href="/" className="text-2xl font-bold text-primary">
          Bugbook
        </Link>
        <SearchField/>
        <UserButton className="sm:ms-auto"/>
      </div>
    </header>
  );
}
