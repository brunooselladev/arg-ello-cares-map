import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/lib/utils';

function NavLink({ className, activeClassName, pendingClassName, to, href, ...props }) {
  const pathname = usePathname() || '/';
  const finalHref = href ?? to ?? '/';
  const isActive = pathname === finalHref;

  return (
    <Link
      href={finalHref}
      className={cn(className, isActive && activeClassName, pendingClassName && false)}
      {...props}
    />
  );
}

export { NavLink };

