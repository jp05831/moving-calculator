import { Truck } from 'lucide-react';
import Link from 'next/link';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="py-4 px-4 bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto flex items-center justify-center gap-3">
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg shadow-red-500/25">
              <Truck className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight">
              <span className="text-red-600">Freedom</span>
              <span className="text-slate-800"> Movers</span>
            </h1>
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-3xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 md:p-12">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Terms of Service</h1>
          <p className="text-slate-500 mb-8">Effective Date: January 1, 2026</p>

          <div className="prose prose-slate max-w-none">
            <h2>1. Introduction</h2>
            <p>
              Welcome to Freedom Movers. These Terms of Service ("Terms" or "Agreement") constitute a legally binding agreement between you ("User" or "you") and Freedom Movers, LLC ("Freedom Movers," "we," "us," or "our"). By accessing or using the website www.freedommovers.co ("Site"), including via telephone, SMS, mail, or email, you agree to be bound by these Terms. If you do not agree, you are not authorized to use the Site.
            </p>
            <p>
              Freedom Movers operates as a marketing and referral platform that connects consumers with independent moving service providers. Freedom Movers does not perform moving services and is not a motor carrier.
            </p>

            <h2>2. Acceptance of Terms</h2>
            <p>
              By accessing or using the Site, you acknowledge that you have read, understood, and agree to be bound by these Terms. Freedom Movers reserves the right to update or modify these Terms at any time without prior notice. Continued use of the Site following changes constitutes acceptance of the updated Terms.
            </p>

            <h2>3. Privacy Policy</h2>
            <p>
              Your use of the Site is governed by our <Link href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</Link>, which is incorporated into these Terms by reference.
            </p>

            <h2>4. Electronic Communications</h2>
            <p>
              By using the Site or communicating with Freedom Movers electronically, you consent to receive communications from us electronically. Such communications satisfy any legal requirement that they be in writing.
            </p>

            <h2>5. Children Under Thirteen</h2>
            <p>
              Freedom Movers does not knowingly collect personal information from individuals under the age of thirteen. If you are under 18, you may use the Site only with parental or guardian consent.
            </p>

            <h2>6. Nature of Services</h2>
            <p>
              Freedom Movers is a marketing and referral service that connects users with third-party moving companies. Freedom Movers:
            </p>
            <ul>
              <li>Does not transport household goods</li>
              <li>Is not a licensed motor carrier</li>
              <li>Does not supervise or control third-party movers</li>
              <li>Does not guarantee pricing, availability, or service quality</li>
            </ul>
            <p>
              Any agreement for moving services is solely between you and the selected third-party moving company.
            </p>

            <h2>7. Use of the Site</h2>
            <p>
              You agree not to use the Site for any unlawful purpose. You may not damage, disable, overburden, or impair the Site or interfere with any other party's use of the Site.
            </p>

            <h2>8. Links to Third-Party Sites</h2>
            <p>
              The Site may contain links to third-party websites. Freedom Movers is not responsible for the content or practices of third-party sites.
            </p>

            <h2>9. Third-Party Services and Lead Sharing</h2>
            <p>
              By submitting your information through the Site, you authorize Freedom Movers to share your information with one or more independent moving service providers for the purpose of providing moving quotes and services.
            </p>
            <p>
              Freedom Movers is not responsible for the actions, services, or omissions of any third-party moving company. Any disputes must be resolved directly with the provider.
            </p>

            <h2>10. Consent to Contact / SMS Policy</h2>
            <p>
              By providing your contact information, including your phone number, you expressly consent to receive marketing calls and text messages (including via automated technology or prerecorded voice) from:
            </p>
            <ul>
              <li>Freedom Movers</li>
              <li>Freedom Movers' service partners</li>
              <li>Third-party moving providers</li>
            </ul>
            <p>
              Consent is not a condition of purchase. Message and data rates may apply. You may opt out at any time by replying "STOP" to a text message. You represent that you are the authorized user of the phone number provided.
            </p>

            <h2>11. Indemnification</h2>
            <p>
              You agree to indemnify, defend, and hold harmless Freedom Movers and its officers, directors, employees, and affiliates from any claims, damages, or expenses arising from:
            </p>
            <ul>
              <li>Your use of the Site</li>
              <li>Your violation of these Terms</li>
              <li>Any dispute between you and a third-party moving provider</li>
            </ul>

            <h2>12. Limitation of Liability</h2>
            <p className="uppercase font-semibold">
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, FREEDOM MOVERS DISCLAIMS ALL WARRANTIES, EXPRESS OR IMPLIED.
            </p>
            <p>
              Freedom Movers shall not be liable for any direct, indirect, incidental, special, consequential, or punitive damages arising out of:
            </p>
            <ul>
              <li>Your use of the Site</li>
              <li>Communications with third-party providers</li>
              <li>Services performed by third-party movers</li>
            </ul>

            <h2>13. Termination</h2>
            <p>
              Freedom Movers reserves the right to suspend or terminate access to the Site at any time for conduct that violates these Terms or is harmful to the Site or its users.
            </p>

            <h2>14. Governing Law and Jurisdiction</h2>
            <p>
              These Terms are governed by the laws of the State of Florida.
            </p>

            <h2>15. Class Action Waiver</h2>
            <p>
              All claims and disputes must be resolved on an individual basis. You agree not to participate in any class, collective, or representative action.
            </p>

            <h2>16. Dispute Resolution and Arbitration</h2>
            <p>
              Any dispute arising from these Terms shall be resolved by binding arbitration in Florida under the rules of the American Arbitration Association (AAA). Judgment on the award may be entered in any court having jurisdiction.
            </p>

            <h2>17. Intellectual Property</h2>
            <p>
              All content on the Site is the property of Freedom Movers and protected by intellectual property laws. You may not reproduce or distribute Site content without written permission.
            </p>

            <h2>18. Data Protection and Security</h2>
            <p>
              Freedom Movers employs reasonable security measures to protect your information but cannot guarantee absolute security.
            </p>

            <h2>19. Modification of Services</h2>
            <p>
              Freedom Movers reserves the right to modify or discontinue any service or feature of the Site at any time without notice.
            </p>

            <h2>20. Severability</h2>
            <p>
              If any provision of these Terms is found unenforceable, the remaining provisions remain in full force.
            </p>

            <h2>21. Entire Agreement</h2>
            <p>
              These Terms constitute the entire agreement between you and Freedom Movers regarding use of the Site.
            </p>

            <h2>22. Contact Information</h2>
            <p>
              Freedom Movers LLC<br />
              <a href="mailto:info@movescout.net" className="text-blue-600 hover:underline">info@movescout.net</a>
            </p>
          </div>

          <div className="mt-12 pt-8 border-t border-slate-200">
            <Link 
              href="/" 
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
            >
              ← Back to Calculator
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 px-4">
        <div className="max-w-3xl mx-auto text-center text-sm text-slate-500">
          © 2026 Freedom Movers LLC. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
