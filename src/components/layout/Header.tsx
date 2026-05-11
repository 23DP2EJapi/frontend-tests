import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Heart, LogOut, FileText, Shield, ClipboardList, UserCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { useIsAdmin } from "@/hooks/useAdmin";
import { useProfile } from "@/hooks/useProfile";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { user, signOut, loading } = useAuth();
  const { data: isAdmin } = useIsAdmin();
  const { data: profile } = useProfile(user?.id);
  const displayName = profile?.full_name || user?.user_metadata?.full_name || user?.email;

  const navLinks = [
    { href: "/", label: "Sākums" },
    { href: "/listings", label: "Sludinājumi" },
    { href: "/about", label: "Par mums" },
    { href: "/contact", label: "Kontakti" },
  ];

  const isActive = (path: string) => location.pathname === path;

  const handleSignOut = async () => {
    await signOut();
    setIsMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
            <Heart className="h-5 w-5 text-primary-foreground" fill="currentColor" />
          </div>
          <span className="text-xl font-bold text-foreground">Brīvprātīgie.lv</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive(link.href)
                  ? "bg-secondary text-secondary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-3">
          {!loading && (
            <>
              {user ? (
                <>
                  <Button variant="ghost" size="sm" asChild>
                    <Link to="/my-applications">
                      <ClipboardList className="h-4 w-4 mr-2" />
                      Mani pieteikumi
                    </Link>
                  </Button>
                  <Button variant="ghost" size="sm" asChild>
                    <Link to="/my-listings">
                      <FileText className="h-4 w-4 mr-2" />
                      Mani sludinājumi
                    </Link>
                  </Button>
                  {isAdmin && (
                    <Button variant="ghost" size="sm" asChild>
                      <Link to="/admin">
                        <Shield className="h-4 w-4 mr-2" />
                        Admin
                      </Link>
                    </Button>
                  )}
                  <Button variant="ghost" size="sm" asChild>
                    <Link to="/profile">
                      <UserCircle className="h-4 w-4 mr-2" />
                      {displayName}
                    </Link>
                  </Button>
                  <Button variant="outline" onClick={handleSignOut}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Iziet
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="outline" asChild>
                    <Link to="/login">Ieiet</Link>
                  </Button>
                  <Button variant="default" asChild>
                    <Link to="/register">Reģistrēties</Link>
                  </Button>
                </>
              )}
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label={isMenuOpen ? "Aizvērt izvēlni" : "Atvērt izvēlni"}
        >
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden border-t border-border bg-background"
          >
            <nav className="container py-4 flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`px-4 py-3 rounded-lg text-base font-medium transition-colors ${
                    isActive(link.href)
                      ? "bg-secondary text-secondary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-border">
                {!loading && (
                  <>
                    {user ? (
                      <>
                        <Button variant="ghost" asChild className="w-full justify-start">
                          <Link to="/profile" onClick={() => setIsMenuOpen(false)}>
                            <UserCircle className="h-4 w-4 mr-2" />
                            {displayName}
                          </Link>
                        </Button>
                        <Button variant="ghost" asChild className="w-full justify-start">
                          <Link to="/my-applications" onClick={() => setIsMenuOpen(false)}>
                            <ClipboardList className="h-4 w-4 mr-2" />
                            Mani pieteikumi
                          </Link>
                        </Button>
                        <Button variant="ghost" asChild className="w-full justify-start">
                          <Link to="/my-listings" onClick={() => setIsMenuOpen(false)}>
                            <FileText className="h-4 w-4 mr-2" />
                            Mani sludinājumi
                          </Link>
                        </Button>
                        {isAdmin && (
                          <Button variant="ghost" asChild className="w-full justify-start">
                            <Link to="/admin" onClick={() => setIsMenuOpen(false)}>
                              <Shield className="h-4 w-4 mr-2" />
                              Admin
                            </Link>
                          </Button>
                        )}
                        <Button variant="outline" onClick={handleSignOut} className="w-full">
                          <LogOut className="h-4 w-4 mr-2" />
                          Iziet
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button variant="outline" asChild className="w-full">
                          <Link to="/login" onClick={() => setIsMenuOpen(false)}>Ieiet</Link>
                        </Button>
                        <Button variant="default" asChild className="w-full">
                          <Link to="/register" onClick={() => setIsMenuOpen(false)}>Reģistrēties</Link>
                        </Button>
                      </>
                    )}
                  </>
                )}
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
