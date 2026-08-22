type IconeProps = {
  className?: string;
};

export function IconePlus({ className }: IconeProps) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M10 3v14M3 10h14" strokeLinecap="round" />
    </svg>
  );
}

export function IconeBusca({ className }: IconeProps) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6">
      <circle cx="8.8" cy="8.8" r="5.3" />
      <path d="M16.5 16.5l-3.6-3.6" strokeLinecap="round" />
    </svg>
  );
}

export function IconeLapis({ className }: IconeProps) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path
        d="M12.9 3.6a1.7 1.7 0 0 1 2.4 0l1.1 1.1a1.7 1.7 0 0 1 0 2.4L6.5 16.9l-3.8.9.9-3.8Z"
        strokeLinejoin="round"
      />
      <path d="M11.3 5.2 15 8.9" strokeLinecap="round" />
    </svg>
  );
}

export function IconeLixeira({ className }: IconeProps) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M4 6h12M8 6V4.5h4V6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5.5 6 6.2 16a1 1 0 0 0 1 .9h5.6a1 1 0 0 0 1-1L14.5 6" strokeLinejoin="round" />
      <path d="M8.3 9v5M11.7 9v5" strokeLinecap="round" />
    </svg>
  );
}

export function IconeFechar({ className }: IconeProps) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M5 5l10 10M15 5 5 15" strokeLinecap="round" />
    </svg>
  );
}

export function IconeAlerta({ className }: IconeProps) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M10 2.5 18 16.5H2Z" strokeLinejoin="round" />
      <path d="M10 8v3.4" strokeLinecap="round" />
      <circle cx="10" cy="14" r="0.15" fill="currentColor" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}

export function IconeSetaEsquerda({ className }: IconeProps) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M12.5 4.5 6 10l6.5 5.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IconeSetaDireita({ className }: IconeProps) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M7.5 4.5 14 10l-6.5 5.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
