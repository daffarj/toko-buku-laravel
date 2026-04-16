import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { ShoppingCart, Search, User, BookOpen, Menu, X } from "lucide-react";
import { useApp } from "../context/AppContext";

interface NavbarProps {
  onSearch?: (query: string) => void;
  searchValue?: string;
}

export function Navbar({ onSearch, searchValue = "" }: NavbarProps) {
  const { cartCount } = useApp();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [localSearch, setLocalSearch] = useState(searchValue);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(localSearch);
    } else {
      navigate(`/?search=${encodeURIComponent(localSearch)}`);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-[#1E3A5F] shadow-lg">
      <div className="max-w-[1280px] mx-auto px-4 py-3">
        <div className="flex items-center gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-8 h-8 bg-[#F59E0B] rounded-lg flex items-center justify-center">
              <BookOpen size={18} className="text-white" />
            </div>
            <span className="text-white text-lg font-semibold hidden sm:block">Toko Buku</span>
          </Link>

          {/* Search */}
          <form onSubmit={handleSearch} className="flex-1 max-w-[40%] hidden md:block">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7280]" />
              <input
                type="text"
                value={localSearch}
                onChange={(e) => {
                  setLocalSearch(e.target.value);
                  if (onSearch) onSearch(e.target.value);
                }}
                placeholder="Cari buku, penulis, atau ISBN..."
                className="w-full pl-9 pr-4 py-2 rounded-lg text-sm bg-white text-[#1F2937] outline-none focus:ring-2 focus:ring-[#F59E0B]"
              />
            </div>
          </form>

          {/* Right actions */}
          <div className="ml-auto flex items-center gap-3">
            <Link to="/cart" className="relative p-2 text-white hover:text-[#F59E0B] transition-colors">
              <ShoppingCart size={22} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#F59E0B] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold">
                  {cartCount > 9 ? "9+" : cartCount}
                </span>
              )}
            </Link>
            <Link
              to="/admin"
              className="hidden sm:flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white text-sm px-3 py-1.5 rounded-lg transition-colors"
            >
              <User size={16} />
              <span>Admin</span>
            </Link>
            <button
              className="sm:hidden text-white"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile search */}
        <div className="mt-2 md:hidden">
          <form onSubmit={handleSearch}>
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7280]" />
              <input
                type="text"
                value={localSearch}
                onChange={(e) => {
                  setLocalSearch(e.target.value);
                  if (onSearch) onSearch(e.target.value);
                }}
                placeholder="Cari buku..."
                className="w-full pl-9 pr-4 py-2 rounded-lg text-sm bg-white text-[#1F2937] outline-none"
              />
            </div>
          </form>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="mt-2 py-2 border-t border-white/20 sm:hidden">
            <Link to="/admin" className="flex items-center gap-2 text-white text-sm py-2">
              <User size={16} />
              Panel Admin
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
