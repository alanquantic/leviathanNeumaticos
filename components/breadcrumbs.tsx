'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, Home } from 'lucide-react';
import { Fragment } from 'react';
import { useLanguage } from '@/lib/i18n/context';

export function Breadcrumbs() {
  const { t } = useLanguage();
  const pathname = usePathname();
  
  if (!pathname || pathname === '/') {
    return null;
  }

  const pathMapping: Record<string, string> = {
    'calculator': t.breadcrumbs.calculator,
    'financials': t.breadcrumbs.financials,
    'analyzer': t.breadcrumbs.analyzer,
  };

  const paths = pathname.split('/').filter(Boolean);

  return (
    <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6" aria-label="Breadcrumb">
      <Link 
        href="/" 
        className="flex items-center gap-1 hover:text-foreground transition-colors"
      >
        <Home className="h-4 w-4" />
        <span className="hidden sm:inline">{t.breadcrumbs.home}</span>
      </Link>
      
      {paths.map((path, index) => {
        const href = '/' + paths.slice(0, index + 1).join('/');
        const label = pathMapping[path] || path.charAt(0).toUpperCase() + path.slice(1);
        const isLast = index === paths.length - 1;

        return (
          <Fragment key={path}>
            <ChevronRight className="h-4 w-4" />
            {isLast ? (
              <span className="font-medium text-foreground">{label}</span>
            ) : (
              <Link href={href} className="hover:text-foreground transition-colors">
                {label}
              </Link>
            )}
          </Fragment>
        );
      })}
    </nav>
  );
}
