const LOGO_DEV_PUBLIC_KEY = import.meta.env.VITE_LOGO_DEV_PUBLIC_KEY;

function getCompanyLogo({ domain }) {
  if (!domain) return;
  const logoUrl = `https://img.logo.dev/${domain}?token=${LOGO_DEV_PUBLIC_KEY}`;
  return logoUrl;
}

function getCompanyLogoByName({ name }) {
  if (!name) return;
  const logoUrl = `https://img.logo.dev/name/${name}?token=${LOGO_DEV_PUBLIC_KEY}`;
  return logoUrl;
}

export { getCompanyLogo, getCompanyLogoByName };
