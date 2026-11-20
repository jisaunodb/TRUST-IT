interface BrandLogoProps {
  variant?: 'navbar' | 'footer' | 'hero' | 'sidebar' | 'login';
  className?: string;
}

const SIZE_CLASSES: Record<NonNullable<BrandLogoProps['variant']>, string> = {
  navbar: 'w-[78px]',
  footer: 'w-36',
  hero: 'w-24 sm:w-28',
  sidebar: 'w-[68px]',
  login: 'w-40',
};

export function BrandLogo({ variant = 'navbar', className = '' }: BrandLogoProps) {
  return (
    <span
      className={`relative inline-block aspect-[4/3] overflow-hidden shrink-0 select-none ${SIZE_CLASSES[variant]} ${className}`}
    >
      <img
        src="/assets/aistudio/Trust-It-logo-Photoroom_19eff7ca.png"
        alt="Trust IT — Social Media Solutions"
        className="w-full h-full object-cover scale-[1.66] origin-center pointer-events-none"
      />
    </span>
  );
}
