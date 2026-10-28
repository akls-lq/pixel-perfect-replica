import google from "@/assets/companies/google.svg";
import microsoft from "@/assets/companies/microsoft.svg";
import ibm from "@/assets/companies/ibm.svg";
import adobe from "@/assets/companies/adobe.svg";
import airbnb from "@/assets/companies/airbnb.svg";
import spotify from "@/assets/companies/spotify.svg";
import meta from "@/assets/companies/meta.svg";
import salesforce from "@/assets/companies/salesforce.svg";
import intel from "@/assets/companies/intel.svg";
import samsung from "@/assets/companies/samsung.svg";
import oracle from "@/assets/companies/oracle.svg";
import stripe from "@/assets/companies/stripe.svg";
import netflix from "@/assets/companies/netflix.svg";
import visa from "@/assets/companies/visa.svg";
import linkedin from "@/assets/companies/linkedin.svg";
// Examples of employers to explore, never a list of clients, partners or verified placements.
// Assets are local SVG wordmarks; provenance is recorded in src/assets/companies/README.md.
export const companyLogos = [
  { name: "Google", src: google, width: 104 },
  { name: "Microsoft", src: microsoft, width: 126 },
  { name: "IBM", src: ibm, width: 82 },
  { name: "Adobe", src: adobe, width: 104 },
  { name: "Airbnb", src: airbnb, width: 112 },
  { name: "Spotify", src: spotify, width: 112 },
  { name: "Meta", src: meta, width: 100 },
  { name: "Salesforce", src: salesforce, width: 74 },
  { name: "Intel", src: intel, width: 80 },
  { name: "Samsung", src: samsung, width: 120 },
  { name: "Oracle", src: oracle, width: 116 },
  { name: "Stripe", src: stripe, width: 84 },
  { name: "Netflix", src: netflix, width: 96 },
  { name: "Visa", src: visa, width: 78 },
  { name: "LinkedIn", src: linkedin, width: 106 },
] as const;
