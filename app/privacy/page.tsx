import { Truck } from 'lucide-react';
import Link from 'next/link';

export default function PrivacyPage() {
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
              <span className="text-blue-800">Freedom</span>
              <span className="text-slate-800"> Movers</span>
            </h1>
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-3xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 md:p-12">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Privacy Policy</h1>
          <p className="text-slate-500 mb-8">Effective Date: January 1, 2026</p>

          <div className="prose prose-slate max-w-none">
            <h2>1. Introduction</h2>
            <p>
              Freedom Movers, LLC ("Freedom Movers," "we," "us," or "our") respects your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website www.freedommovers.co ("Site").
            </p>

            <h2>2. Collection of Personal Information</h2>
            <p>
              We may collect personally identifiable information ("Personal Information"), including but not limited to:
            </p>
            <ul>
              <li>Name</li>
              <li>Address</li>
              <li>Email Address</li>
              <li>Phone Number</li>
              <li>Move Details (origin, destination, move date)</li>
            </ul>
            <p>
              We collect this information when you voluntarily provide it, such as when requesting a moving quote. We may also automatically collect information such as IP address, browser type, device information, access times, and referring website addresses.
            </p>

            <h2>3. Use of Personal Information</h2>
            <p>
              We use your Personal Information to:
            </p>
            <ul>
              <li>Operate the Site and deliver requested services</li>
              <li>Connect you with independent moving service providers</li>
              <li>Communicate with you regarding your request</li>
              <li>Improve our marketing and services</li>
            </ul>

            <h2>4. Sharing of Personal Information</h2>
            <p>
              By submitting your information, you authorize us to share your Personal Information with independent moving service providers and service partners for the purpose of providing moving quotes and related services.
            </p>
            <p>
              We may also share information with vendors who assist us in operating the Site. These vendors are required to maintain confidentiality.
            </p>
            <p>
              We may disclose Personal Information if required by law or to protect our legal rights.
            </p>

            <h2>5. Sale of Information</h2>
            <p>
              We may sell, transfer, or otherwise provide your information to moving service providers in connection with your request for moving services.
            </p>

            <h2>6. Use of Cookies and Tracking Technologies</h2>
            <p>
              The Site may use cookies and similar tracking technologies to enhance user experience, analyze traffic, and improve advertising performance. You may modify your browser settings to decline cookies, though some features may not function properly.
            </p>

            <h2>7. Security of Your Personal Information</h2>
            <p>
              We implement reasonable administrative, technical, and physical safeguards to protect your Personal Information. However, no system can guarantee absolute security.
            </p>

            <h2>8. Retention of Personal Information</h2>
            <p>
              We retain Personal Information only as long as necessary to fulfill the purposes outlined in this Privacy Policy or as required by law.
            </p>

            <h2>9. Children Under Thirteen</h2>
            <p>
              We do not knowingly collect Personal Information from children under the age of thirteen.
            </p>

            <h2>10. Your Privacy Rights</h2>
            <p>
              Depending on your state of residence, you may have rights regarding your Personal Information, including the right to access, delete, or request information about how your data is used.
            </p>
            <p>
              To exercise these rights, contact us at <a href="mailto:info@freedommovers.co" className="text-blue-600 hover:underline">info@freedommovers.co</a>.
            </p>

            <h2>11. Opt-Out of Communications</h2>
            <p>
              You may opt out of marketing communications at any time by replying STOP to SMS messages or contacting us at <a href="mailto:info@freedommovers.co" className="text-blue-600 hover:underline">info@freedommovers.co</a>.
            </p>

            <h2>12. Do Not Track Signals</h2>
            <p>
              We do not currently respond to "Do Not Track" browser signals.
            </p>

            <h2>13. Data Breach Response</h2>
            <p>
              In the event of a data breach, we will take reasonable steps to notify affected individuals as required by applicable law.
            </p>

            <h2>14. Changes to This Privacy Policy</h2>
            <p>
              We may update this Privacy Policy periodically. The updated version will be posted on this page with a revised effective date.
            </p>

            <h2>15. Contact Information</h2>
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
