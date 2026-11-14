/**
 * Central Configuration for Dr. Jithin Lal
 * Nephrologist / Kidney Specialist at Amrutha Hospital, Kalamassery, Kochi
 * All values rendered dynamically across pages.
 */
const CLINIC_CONFIG = {
  // Doctor Profile
  doctorName: "Dr. Jithin Lal",
  titlePrefix: "Dr.",
  speciality: "Nephrologist / Kidney Specialist",
  designation: "Consultant Nephrologist & Kidney Specialist",
  qualifications: "MBBS, MD (General Medicine), DM (Nephrology)",
  degrees: ["MBBS", "MD (General Medicine)", "DM (Nephrology)"],
  experienceYears: 15,
  experienceDisplay: "15 Years",

  // Hospital & Location
  hospital: "Amrutha Hospital",
  clinicName: "Amrutha Hospital, Kalamassery",
  address: "Amrutha Hospital, Kalamassery, Kochi, Kerala",
  fullAddress: "Amrutha Hospital, Kalamassery, Kochi, Kerala, India",
  city: "Kochi",
  locality: "Kalamassery",
  state: "Kerala",
  country: "India",

  // Contact Details
  phone: "+91 97458 66333",
  phoneRaw: "9745866333",
  whatsapp: "+91 97458 66333",
  whatsappRaw: "9745866333",
  whatsappUrl: "https://wa.me/919745866333",
  email: "vismaya@stackertec.com",

  // Consultation Timings
  timings: "Monday to Saturday: 10:30 AM – 5:30 PM & 9:00 PM – 1:00 AM · Sunday: 9:00 AM – 4:00 PM",
  timingsWeekdays: "10:30 AM – 5:30 PM & 9:00 PM – 1:00 AM",
  timingsSunday: "9:00 AM – 4:00 PM",
  timingsShort: "Mon–Sat: 10:30 AM–5:30 PM, 9 PM–1 AM · Sun: 9 AM–4 PM",

  // Professional Background & Credentials
  previousHospitals: "BMH Kozhikode (Baby Memorial Hospital)",
  memberships: "ISNSC (Indian Society of Nephrology - Southern Chapter), ASN (American Society of Nephrology)",
  membershipList: [
    "Indian Society of Nephrology - Southern Chapter (ISNSC)",
    "American Society of Nephrology (ASN)"
  ],
  registration: "Kerala State Medical Councils (KSMC)",
  achievements: [
    "Excellence in Nephrology Practice",
    "Recognition for Clinical Contributions",
    "Outstanding Medical Service Awards"
  ],

  // Maps Link
  mapsLink: "https://share.google/udCwgDnAncq3Zrb6b",
  mapSearchQuery: "Amrutha+Hospital+Kalamassery+Kochi",

  // SEO & Deployment Base (Keep empty string until official domain is connected)
  siteUrl: ""
};

// Helper function to safely get text or fallback
function getConfigValue(key, fallback = "Details coming soon") {
  const val = CLINIC_CONFIG[key];
  if (val === undefined || val === null || val === "") return fallback;
  return val;
}

// Render dynamic configuration fields into the DOM
function renderConfigData() {
  // Replace elements with data-config attribute
  document.querySelectorAll("[data-config]").forEach(el => {
    const key = el.getAttribute("data-config");
    const val = CLINIC_CONFIG[key];
    if (val !== undefined && val !== null && val !== "") {
      el.textContent = val;
    } else {
      el.textContent = "Details coming soon";
    }
  });

  // Handle phone links
  document.querySelectorAll("[data-config-phone]").forEach(el => {
    if (CLINIC_CONFIG.phoneRaw) {
      el.href = `tel:+91${CLINIC_CONFIG.phoneRaw}`;
      if (el.hasAttribute("data-config-phone-text")) {
        el.textContent = CLINIC_CONFIG.phone;
      }
      el.style.display = "";
    } else {
      el.style.display = "none";
    }
  });

  // Handle WhatsApp links
  document.querySelectorAll("[data-config-whatsapp]").forEach(el => {
    if (CLINIC_CONFIG.whatsappRaw) {
      el.href = `https://wa.me/91${CLINIC_CONFIG.whatsappRaw}`;
      if (el.hasAttribute("data-config-whatsapp-text")) {
        el.textContent = CLINIC_CONFIG.whatsapp;
      }
      el.style.display = "";
    } else {
      el.style.display = "none";
    }
  });

  // Handle Email links
  document.querySelectorAll("[data-config-email]").forEach(el => {
    if (CLINIC_CONFIG.email) {
      el.href = `mailto:${CLINIC_CONFIG.email}`;
      if (el.hasAttribute("data-config-email-text")) {
        el.textContent = CLINIC_CONFIG.email;
      }
      el.style.display = "";
    } else {
      el.style.display = "none";
    }
  });

  // Handle Maps link
  document.querySelectorAll("[data-config-maps]").forEach(el => {
    if (CLINIC_CONFIG.mapsLink) {
      el.href = CLINIC_CONFIG.mapsLink;
    }
  });

  // Handle experience count-up target
  document.querySelectorAll("[data-config-experience]").forEach(el => {
    el.setAttribute("data-n", CLINIC_CONFIG.experienceYears);
  });

  // SEO: only output canonical / og:url / JSON-LD when siteUrl is filled
  if (CLINIC_CONFIG.siteUrl && CLINIC_CONFIG.siteUrl.trim() !== "") {
    const pagePath = window.location.pathname.split("/").pop() || "index.html";
    const fullUrl = `${CLINIC_CONFIG.siteUrl.replace(/\/$/, "")}/${pagePath}`;

    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = fullUrl;

    let ogUrl = document.querySelector('meta[property="og:url"]');
    if (!ogUrl) {
      ogUrl = document.createElement("meta");
      ogUrl.setAttribute("property", "og:url");
      document.head.appendChild(ogUrl);
    }
    ogUrl.content = fullUrl;

    // Inject JSON-LD
    const jsonLdScript = document.createElement("script");
    jsonLdScript.type = "application/ld+json";
    jsonLdScript.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Physician",
      "name": CLINIC_CONFIG.doctorName,
      "medicalSpecialty": "Nephrology",
      "worksFor": {
        "@type": "Hospital",
        "name": CLINIC_CONFIG.hospital,
        "address": {
          "@type": "PostalAddress",
          "streetAddress": CLINIC_CONFIG.address,
          "addressLocality": CLINIC_CONFIG.city,
          "addressRegion": CLINIC_CONFIG.state,
          "addressCountry": CLINIC_CONFIG.country
        }
      },
      "telephone": `+91-${CLINIC_CONFIG.phoneRaw}`,
      "email": CLINIC_CONFIG.email,
      "url": fullUrl
    });
    document.head.appendChild(jsonLdScript);
  }
}

// Auto-run when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", renderConfigData);
} else {
  renderConfigData();
}

// Freeze to prevent accidental modification
if (typeof Object.freeze === "function") {
  Object.freeze(CLINIC_CONFIG);
}
