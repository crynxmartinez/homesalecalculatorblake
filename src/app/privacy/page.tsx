import Link from "next/link";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <Link
          href="/"
          className="inline-flex items-center text-blue-500 hover:text-blue-600 mb-8"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back to Home
        </Link>

        <h1 className="text-3xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
        <p className="text-gray-500 mb-8">Effective Date: June 23rd, 2025</p>

        <div className="prose prose-gray max-w-none">
          <p className="mb-4">
            <strong>Website:</strong> HomeSaleCalculator.com
            <br />
            <strong>Operated by:</strong> Real Agent LLC, a Wyoming limited liability company
          </p>

          <h2 className="text-xl font-bold mt-8 mb-4">1. Introduction</h2>
          <p>
            This Privacy Policy describes how Real Agent LLC (&quot;we,&quot; &quot;us,&quot; &quot;our&quot;) collects, uses, and protects the personal information you provide through HomeSaleCalculator.com (&quot;Site&quot;). By using this Site, you agree to the terms of this Privacy Policy.
          </p>

          <h2 className="text-xl font-bold mt-8 mb-4">2. Information We Collect</h2>
          <p>We collect the following types of personal information when you visit or use the Site:</p>
          <ul className="list-disc pl-6 mb-4">
            <li>Name, phone number, email address, and mailing address</li>
            <li>Property details you submit (e.g., address, condition)</li>
            <li>IP address, browser type, device information, and pages visited</li>
            <li>Consent data (checkbox status, timestamps)</li>
          </ul>

          <h2 className="text-xl font-bold mt-8 mb-4">3. How We Use Your Information</h2>
          <p>We use your information to:</p>
          <ul className="list-disc pl-6 mb-4">
            <li>Contact you regarding your home and interest in selling</li>
            <li>Match you with licensed real estate professionals and investor-buyers</li>
            <li>Send relevant offers and information via email, text, or phone</li>
            <li>Improve our services and user experience</li>
            <li>Comply with legal obligations and enforce our terms</li>
          </ul>

          <h2 className="text-xl font-bold mt-8 mb-4">4. Sharing of Information</h2>
          <p>We may share your personal information with:</p>
          <ul className="list-disc pl-6 mb-4">
            <li>Licensed real estate agents and investor-buyers in your area</li>
            <li>Marketing and referral partners who help us connect you with professionals</li>
            <li>Third-party vendors providing services such as web hosting or analytics</li>
            <li>Government authorities if required by law or legal process</li>
          </ul>

          <h2 className="text-xl font-bold mt-8 mb-4">5. Third-Party Links</h2>
          <p>
            Our Site may contain links to other websites or services not operated by us. We are not responsible for the privacy practices or content of those sites.
          </p>

          <h2 className="text-xl font-bold mt-8 mb-4">6. Cookies & Tracking Technologies</h2>
          <p>We use cookies and similar tracking technologies to:</p>
          <ul className="list-disc pl-6 mb-4">
            <li>Understand user behavior</li>
            <li>Improve site performance</li>
            <li>Deliver targeted advertising</li>
          </ul>
          <p>You can modify your browser settings to disable cookies, but some features may not function properly.</p>

          <h2 className="text-xl font-bold mt-8 mb-4">7. Data Security</h2>
          <p>
            We implement reasonable safeguards to protect your personal information. However, no method of transmission over the internet or electronic storage is completely secure. We cannot guarantee absolute security.
          </p>

          <h2 className="text-xl font-bold mt-8 mb-4">8. Children&apos;s Privacy</h2>
          <p>
            This Site is not intended for children under the age of 18. We do not knowingly collect personal information from children.
          </p>

          <h2 className="text-xl font-bold mt-8 mb-4">9. Your Choices & Rights</h2>
          <p>
            You may opt out of receiving marketing communications at any time by following the unsubscribe instructions or emailing support@motivatedsellerexchange.com. You may also request access to or deletion of your personal data by contacting us.
          </p>

          <h2 className="text-xl font-bold mt-8 mb-4">10. Changes to This Privacy Policy</h2>
          <p>
            We reserve the right to modify this Privacy Policy at any time. Any changes will be posted on this page with an updated effective date. Continued use of the Site after such changes constitutes your acceptance of the new terms.
          </p>

          <h2 className="text-xl font-bold mt-8 mb-4">Contact Us</h2>
          <p>If you have any questions about this Privacy Policy or our data practices, please contact us at:</p>
          <p>
            <strong>Email:</strong> support@motivatedsellerexchange.com
            <br />
            <strong>Mailing Address:</strong> 41951 Remington Ave Suite 260, Temecula, CA 92590
          </p>
        </div>
      </div>
    </div>
  );
}
