import "./CompanyLogo.css";
import React from "react";
const LOGO_DEV_PUBLIC_KEY = import.meta.env.VITE_LOGO_DEV_PUBLIC_KEY;

export default function CompanyLogo({ domain }) {
  const logoUrl = `https://img.logo.dev/${domain}?token=${LOGO_DEV_PUBLIC_KEY}`;
  console.log(logoUrl);
  return <img src={logoUrl} alt={`${domain} logo`} className="company-logo" />;
}
