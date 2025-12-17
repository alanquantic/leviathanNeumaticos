'use client';

import { Button } from '@/components/ui/button';
import { useLanguage } from '@/lib/i18n/context';
import { Globe } from 'lucide-react';

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'es' ? 'en' : 'es');
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleLanguage}
      className="flex items-center gap-2"
      title={language === 'es' ? 'Switch to English' : 'Cambiar a Español'}
    >
      <Globe className="h-4 w-4" />
      <span className="text-sm font-medium uppercase">
        {language}
      </span>
    </Button>
  );
}
