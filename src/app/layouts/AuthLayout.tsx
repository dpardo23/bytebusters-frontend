import { Outlet } from 'react-router-dom';

export function AuthLayout() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_top,#eef2ff_0%,#f8fafc_38%,#f8fafc_100%)] px-4 py-10 dark:bg-[radial-gradient(circle_at_top,rgba(79,70,229,0.25)_0%,rgba(2,6,23,1)_42%,rgba(2,6,23,1)_100%)] sm:px-6">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-6rem] top-16 h-56 w-56 rounded-full bg-primary/10 blur-3xl dark:bg-primary/15" />
        <div className="absolute bottom-10 right-[-4rem] h-72 w-72 rounded-full bg-sky-200/40 blur-3xl dark:bg-sky-500/10" />
      </div>
      <div className="relative z-10 w-full max-w-3xl">
        <Outlet />
      </div>
    </div>
  );
}
