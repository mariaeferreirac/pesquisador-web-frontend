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

export function IconeChevronBaixo({ className }: IconeProps) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M4.5 7.5 10 13l5.5-5.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IconePlay({ className }: IconeProps) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="currentColor">
      <path d="M7 4.8v10.4a.8.8 0 0 0 1.22.68l8.2-5.2a.8.8 0 0 0 0-1.36l-8.2-5.2A.8.8 0 0 0 7 4.8Z" />
    </svg>
  );
}

export function IconeVideo({ className }: IconeProps) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6">
      <rect x="2.5" y="4.5" width="10" height="11" rx="1.4" />
      <path d="M12.5 8.2 17 5.6v8.8l-4.5-2.6Z" strokeLinejoin="round" />
    </svg>
  );
}

export function IconeTag({ className }: IconeProps) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path
        d="M10.6 2.8H4.6a1.8 1.8 0 0 0-1.8 1.8v6l8.4 8.4a1.4 1.4 0 0 0 2 0l5.6-5.6a1.4 1.4 0 0 0 0-2Z"
        strokeLinejoin="round"
      />
      <circle cx="7.1" cy="7.1" r="1.1" />
    </svg>
  );
}

export function IconeTendencia({ className }: IconeProps) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M2.5 14.5 8 9l3.2 3.2 6.3-6.7" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M13.8 5.5h3.7v3.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IconeNuvemUpload({ className }: IconeProps) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path
        d="M6 15.5h8a3 3 0 0 0 .6-5.94 4 4 0 0 0-7.66-1.7A3.3 3.3 0 0 0 6 15.5Z"
        strokeLinejoin="round"
      />
      <path d="M10 12.5v-5M7.8 9.4 10 7.2l2.2 2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IconeArquivo({ className }: IconeProps) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M6 2.5h5.5L15 6v11.5a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1Z" strokeLinejoin="round" />
      <path d="M11.2 2.5V6H15" strokeLinejoin="round" />
    </svg>
  );
}
