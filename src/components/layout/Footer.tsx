import logo from "@/assets/ischool-logo.png";

export function Footer() {
  return (
    <footer className="mx-auto mt-24 mb-6 max-w-7xl px-4 sm:px-6">
      <div className="glass rounded-2xl p-6 sm:p-8">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-3">
            <img src={logo} alt="iSchool" className="h-8 w-auto" />
            <span className="text-sm text-muted-foreground">
              Premium learning, reimagined.
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} iSchool. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
