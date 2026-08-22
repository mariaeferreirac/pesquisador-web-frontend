type IconeProps = {
  className?: string;
};

export function IconeUsuarios({ className }: IconeProps) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6">
      <circle cx="7" cy="6.5" r="2.3" />
      <circle cx="14" cy="7.5" r="1.9" />
      <path d="M2.3 16c0-2.6 2.1-4.5 4.7-4.5s4.7 1.9 4.7 4.5" strokeLinecap="round" />
      <path d="M12.2 12c1.9.2 3.5 1.8 3.5 4" strokeLinecap="round" />
    </svg>
  );
}

export function IconeInstituicoes({ className }: IconeProps) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6">
      <rect x="3" y="3" width="14" height="14" rx="1.2" />
      <path d="M3 8h14M7 3v14M13 3v14" />
    </svg>
  );
}

export function IconeAvaliacoes({ className }: IconeProps) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6">
      <rect x="4" y="3.2" width="12" height="14" rx="1.4" />
      <path d="M7.5 2.5h5v2h-5z" strokeLinejoin="round" />
      <path d="M6.8 10l1.7 1.7 3.2-3.4M6.8 14h6.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IconeTreinos({ className }: IconeProps) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6">
      <rect x="3" y="3.5" width="14" height="13" rx="1.6" />
      <path d="M3 7.5h14" />
      <path d="M6.5 2v3M13.5 2v3" strokeLinecap="round" />
    </svg>
  );
}

export function IconeChevron({ className }: IconeProps) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M7.5 4.5 13 10l-5.5 5.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
