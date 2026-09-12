/**
 * Verbatim legal copy for the two long-form policy routes. Both documents run
 * through the same template, so the copy below is the only thing that differs.
 */
export type LegalSection = {
  /** The printed ordinal, e.g. "1." */
  num: string;
  /** Anchor target, also used by the sidebar index links. */
  id: string;
  title: string;
  body: string;
};

export type LegalDoc = {
  /** Route path, so the index links resolve against this same page. */
  route: string;
  heading: string;
  /** Human-readable revision date, with its machine-readable twin. */
  updated: string;
  updatedISO: string;
  sections: LegalSection[];
};

export const PRIVACY_POLICY: LegalDoc = {
  route: "/privacy-policy",
  heading: "Privacy Policy",
  updated: "Jun 17, 2026",
  updatedISO: "2026-06-17T00:00:00.000Z",
  sections: [
    { num: "1.", id: "overview", title: "Overview", body: "This Privacy Policy explains how Nordwell collects, uses, and protects information when you use our Service. By using Nordwell, you agree to the practices described here." },
    { num: "2.", id: "information-we-collect", title: "Information We Collect", body: "We collect account information such as your name, email, and company. We collect connected data from the third party sources you choose to integrate, solely to provide the Service. We collect usage information such as queries run and features used. We also collect device information such as browser type and IP address." },
    { num: "3.", id: "how-we-use-information", title: "How We Use Information", body: "We use the information we collect to provide and improve the Service, build and maintain your knowledge graph, respond to support requests, send important account notifications, and monitor for security and abuse." },
    { num: "4.", id: "data-sharing", title: "Data Sharing", body: "We do not sell your data. We may share information with service providers who help us operate Nordwell, subject to confidentiality obligations, or when required by law." },
    { num: "5.", id: "data-security", title: "Data Security", body: "We use industry standard safeguards, including encryption in transit and at rest, to protect your data. No method of transmission or storage is completely secure, and we cannot guarantee absolute security." },
    { num: "6.", id: "data-retention", title: "Data Retention", body: "We retain your information for as long as your account is active or as needed to provide the Service. Upon cancellation, data is deleted from our systems within 30 days, except where retention is required by law." },
    { num: "7.", id: "your-rights", title: "Your Rights", body: "Depending on your location, you may have the right to access, correct, export, or delete your personal information. To exercise these rights, contact us using the information below." },
    { num: "8.", id: "cookies", title: "Cookies", body: "We use cookies and similar technologies to keep you logged in, remember preferences, and understand how the Service is used. You can control cookies through your browser settings." },
    { num: "9.", id: "childrens-privacy", title: "Children's Privacy", body: "Nordwell is not directed to individuals under the age of 16. We do not knowingly collect personal information from children." },
    { num: "10.", id: "international-transfers", title: "International Transfers", body: "Your information may be transferred to and processed in countries other than your own. We take steps to ensure appropriate safeguards are in place for such transfers." },
    { num: "11.", id: "changes-to-this-policy", title: "Changes to This Policy", body: "We may update this Privacy Policy from time to time. Continued use of the Service after changes take effect constitutes acceptance of the revised policy." },
    { num: "12.", id: "contact", title: "Contact", body: "Questions about this Privacy Policy can be sent to privacy@nordwell.io" },
  ],
};

export const TERMS_OF_SERVICE: LegalDoc = {
  route: "/terms-of-service",
  heading: "Terms and Conditions",
  updated: "Jun 21, 2026",
  updatedISO: "2026-06-21T00:00:00.000Z",
  sections: [
    { num: "1.", id: "acceptance-of-terms", title: "Acceptance of Terms", body: "By accessing or using Nordwell (“the Service”), you agree to be bound by these Terms and Conditions. If you do not agree, please do not use the Service." },
    { num: "2.", id: "description-of-service", title: "Description of Service", body: "Nordwell provides an AI powered data intelligence platform that connects to third party data sources, builds a knowledge graph, and allows natural language querying of connected data. Features and availability may change at any time without notice." },
    { num: "3.", id: "accounts", title: "Accounts", body: "You must provide accurate information when creating an account. You are responsible for maintaining the confidentiality of your credentials and for all activity under your account. Notify us immediately of any unauthorized use." },
    { num: "4.", id: "acceptable-use", title: "Acceptable Use", body: "You agree not to: use the Service for unlawful purposes; attempt to reverse engineer, decompile, or gain unauthorized access to the Service; upload data you do not have the right to share; interfere with the normal operation of the Service." },
    { num: "5.", id: "data-and-integrations", title: "Data and Integrations", body: "You retain ownership of the data you connect to Nordwell. By connecting a data source, you grant us permission to access, process, and store that data solely to provide the Service. You are responsible for ensuring you have the rights to connect any third party data source." },
    { num: "6.", id: "subscription-and-billing", title: "Subscription and Billing", body: "Paid plans are billed in advance on a monthly or annual basis. Fees are non refundable except where required by law. We may change pricing with reasonable advance notice." },
    { num: "7.", id: "termination", title: "Termination", body: "We may suspend or terminate your access if you violate these Terms. You may cancel your subscription at any time. Upon cancellation, your data will be available for export for a limited period before deletion." },
    { num: "8.", id: "disclaimers", title: "Disclaimers", body: "The Service is provided “as is” without warranties of any kind. We do not guarantee that the Service will be uninterrupted, error free, or that insights generated will be accurate or complete." },
    { num: "9.", id: "limitation-of-liability", title: "Limitation of Liability", body: "To the maximum extent permitted by law, Nordwell shall not be liable for any indirect, incidental, or consequential damages arising from your use of the Service." },
    { num: "10.", id: "changes-to-terms", title: "Changes to Terms", body: "We may update these Terms from time to time. Continued use of the Service after changes take effect constitutes acceptance of the revised Terms." },
  ],
};
