import Link from "next/link";

export default function TermsPage() {
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

        <h1 className="text-3xl font-bold text-gray-900 mb-2">Terms of Service</h1>
        <p className="text-gray-500 mb-8">Effective Date: June 23rd, 2025</p>

        <div className="max-w-none text-gray-700">
          <p className="mb-4">
            <strong>Website:</strong> HomeSaleCalculator.com
            <br />
            <strong>Operated by:</strong> Real Agent LLC, a Wyoming limited liability company
          </p>

          <h2 className="text-xl font-bold mt-8 mb-4">Acceptance of Terms</h2>
          <p>
            By accessing or using HomeSaleCalculator.com (the &quot;Site&quot;), you agree to be bound by these Terms of Service (&quot;Terms&quot;), our Privacy Policy, and any applicable laws. If you do not agree, do not use the Site. These Terms form a legally binding agreement between you (&quot;you,&quot; &quot;your,&quot; &quot;user,&quot; or &quot;consumer&quot;) and Real Agent LLC (&quot;we,&quot; &quot;us,&quot; &quot;our&quot;), the owner and operator of this Site.
          </p>

          <h2 className="text-xl font-bold mt-8 mb-4">Purpose of the Site</h2>
          <p>
            HomeSaleCalculator.com is a marketing and lead generation website designed to collect contact information from property owners interested in learning the potential value of their home or exploring selling options. This includes possible connections to licensed real estate agents and/or investor buyers in your area. We are not a licensed real estate brokerage and do not provide real estate representation, appraisals, or brokerage services directly.
          </p>

          <h2 className="text-xl font-bold mt-8 mb-4">Estimated Home Values Disclaimer</h2>
          <p>Any estimated property values shown on this Site or in communications from us are:</p>
          <ul className="list-disc pl-6 mb-4">
            <li>Based on automated algorithms and publicly available data</li>
            <li>Intended for informational purposes only</li>
            <li>Not appraisals, CMAs, or market evaluations by licensed professionals</li>
          </ul>
          <p>
            We make no guarantee or warranty as to the accuracy, completeness, or usefulness of these estimates. Do not rely solely on them for any financial decision or home sale strategy.
          </p>

          <h2 className="text-xl font-bold mt-8 mb-4">Cash Offer Solution Disclaimer</h2>
          <p>By opting into a &quot;cash offer&quot; solution or request, you understand and agree that:</p>
          <ul className="list-disc pl-6 mb-4">
            <li>Not all homes will qualify for a cash offer</li>
            <li>We do not guarantee that a buyer will be identified, nor do we guarantee any specific purchase price or timeline</li>
            <li>Offers, if made, are made by third-party buyers or licensed agents/investors—not by Real Agent LLC or HomeSaleCalculator.com directly</li>
          </ul>

          <h2 className="text-xl font-bold mt-8 mb-4">Lead Collection & Referral Disclosure</h2>
          <p>By submitting your contact information through this Site, you expressly authorize us to:</p>
          <ul className="list-disc pl-6 mb-4">
            <li>Collect, store, and use your data to match you with real estate professionals</li>
            <li>Share your contact details with licensed real estate agents, investor-buyers, or authorized third-party representatives</li>
            <li>Receive compensation for referring your lead to these professionals</li>
          </ul>
          <p>We are a marketing and referral platform, and you understand that your information will be shared for these purposes.</p>

          <h2 className="text-xl font-bold mt-8 mb-4">Consent to Contact (TCPA Compliance)</h2>
          <p>By submitting your contact information, you consent to be contacted via:</p>
          <ul className="list-disc pl-6 mb-4">
            <li>Phone calls (including prerecorded and/or automated calls)</li>
            <li>Text messages (SMS/MMS)</li>
            <li>Emails or direct messages</li>
          </ul>
          <p>This contact may come from:</p>
          <ul className="list-disc pl-6 mb-4">
            <li>Real Agent LLC</li>
            <li>Third-party licensed real estate professionals</li>
            <li>Real estate investors or buyers</li>
            <li>Other parties to whom we refer your information</li>
          </ul>
          <p>You understand and agree that:</p>
          <ul className="list-disc pl-6 mb-4">
            <li>Your consent is not a condition of any purchase</li>
            <li>Message and data rates may apply</li>
            <li>You may opt out at any time by replying &quot;STOP&quot; or contacting support@motivatedsellerexchange.com</li>
          </ul>

          <h2 className="text-xl font-bold mt-8 mb-4">No Agency or Representation Relationship</h2>
          <p>Submitting your information on this Site does not create:</p>
          <ul className="list-disc pl-6 mb-4">
            <li>A client-agent relationship</li>
            <li>A fiduciary duty</li>
            <li>A representation agreement</li>
          </ul>
          <p>You are not under contract with Real Agent LLC. Any real estate agreement you enter into will be with the third-party professional or brokerage to whom you are referred.</p>

          <h2 className="text-xl font-bold mt-8 mb-4">No Warranties or Guarantees</h2>
          <p>We make no warranty or guarantee—express or implied—regarding:</p>
          <ul className="list-disc pl-6 mb-4">
            <li>The accuracy or reliability of home value estimates</li>
            <li>Your eligibility for a cash offer</li>
            <li>The performance, licensing, or reliability of any third-party agent, investor, or service provider</li>
            <li>Any specific outcome, price, sale, or timeframe</li>
          </ul>
          <p>The Site is provided &quot;as is&quot; without warranties of any kind. You use it at your own risk.</p>

          <h2 className="text-xl font-bold mt-8 mb-4">Limitation of Liability</h2>
          <p>To the fullest extent permitted by law, Real Agent LLC shall not be liable for any:</p>
          <ul className="list-disc pl-6 mb-4">
            <li>Losses, damages, claims, or actions arising from your use of this Site</li>
            <li>Communications or transactions with third parties referred through this Site</li>
            <li>Decisions you make based on any home estimate or referral</li>
          </ul>
          <p>We are not responsible for the acts, omissions, or representations of any third party.</p>

          <h2 className="text-xl font-bold mt-8 mb-4">User Representations</h2>
          <p>By using this Site, you represent that:</p>
          <ul className="list-disc pl-6 mb-4">
            <li>You are the rightful owner or legal representative of the property you submit</li>
            <li>You are over the age of 18</li>
            <li>All information you provide is accurate and truthful</li>
            <li>You have read and agree to these Terms</li>
          </ul>

          <h2 className="text-xl font-bold mt-8 mb-4">Governing Law & Jurisdiction</h2>
          <p>These Terms shall be governed by the laws of the State of Wyoming, and any disputes shall be resolved in Natrona County, Wyoming.</p>

          <h2 className="text-xl font-bold mt-8 mb-4">Modifications</h2>
          <p>We reserve the right to update or modify these Terms at any time without notice. Continued use of the Site after changes constitutes acceptance of the revised Terms.</p>

          <h2 className="text-xl font-bold mt-8 mb-4">Contact Us</h2>
          <p>For questions about these Terms or our services, contact us at:</p>
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
