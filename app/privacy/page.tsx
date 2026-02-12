'use client';

export default function PrivacyPage() {
  return (
    <main className="bg-background">
      <section className="py-16 px-4 bg-muted/30">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-serif font-bold text-primary mb-4">
            Privacy Policy
          </h1>
          <p className="text-foreground/70">Last updated: January 2024</p>
        </div>
      </section>

      <section className="py-12 px-4 bg-background">
        <div className="max-w-4xl mx-auto prose prose-invert max-w-none">
          <div className="space-y-8 text-foreground/80">
            <div>
              <h2 className="text-2xl font-serif font-bold text-primary mb-4">
                1. Introduction
              </h2>
              <p>
                The Myriad Hotel ("we," "us," "our," or "Company") is committed to respecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-serif font-bold text-primary mb-4">
                2. Information We Collect
              </h2>
              <p>We may collect information about you in a variety of ways. The information we may collect on the site includes:</p>
              <ul className="list-disc pl-6 mt-4 space-y-2">
                <li><strong>Personal Data:</strong> Name, email address, phone number, mailing address, and payment information</li>
                <li><strong>Booking Information:</strong> Check-in/out dates, room preferences, and special requests</li>
                <li><strong>Communication Data:</strong> Messages, feedback, and inquiries you send to us</li>
                <li><strong>Technical Data:</strong> IP address, browser type, and browsing behavior</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-serif font-bold text-primary mb-4">
                3. Use of Your Information
              </h2>
              <p>Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you via the site to:</p>
              <ul className="list-disc pl-6 mt-4 space-y-2">
                <li>Generate a personal profile about you</li>
                <li>Increase the efficiency and operation of the site</li>
                <li>Monitor and analyze usage and trends to improve your experience</li>
                <li>Process your transactions and send related information</li>
                <li>Email you regarding your account or reservation</li>
                <li>Fulfill and manage your requests</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-serif font-bold text-primary mb-4">
                4. Disclosure of Your Information
              </h2>
              <p>
                We may share information we have collected about you in certain situations:
              </p>
              <ul className="list-disc pl-6 mt-4 space-y-2">
                <li><strong>Service Providers:</strong> To payment processors and other vendors who assist in operating our website</li>
                <li><strong>Legal Requirement:</strong> When required by law or to protect our legal rights</li>
                <li><strong>Business Transfers:</strong> If The Myriad Hotel is involved in a merger or acquisition</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-serif font-bold text-primary mb-4">
                5. Security of Your Information
              </h2>
              <p>
                We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-serif font-bold text-primary mb-4">
                6. Contact Us
              </h2>
              <p>
                If you have questions or comments about this Privacy Policy, please contact us at:
              </p>
              <div className="mt-4 bg-muted/30 p-4 rounded">
                <p><strong>The Myriad Hotel</strong></p>
                <p>Opp. Indian Oil Petrol Pump, Mira Bhayander Road, Mira Road (E)</p>
                <p>Email: privacy@themyriad.com</p>
                <p>Phone: <a href="tel:9619618000" className="text-primary hover:underline">961 961 8000</a></p>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-serif font-bold text-primary mb-4">
                7. Policy Updates
              </h2>
              <p>
                The Myriad Hotel reserves the right to make changes to this policy at any time. Any changes to this policy will be effective immediately upon posting to the website. Your continued use of the website following the posting of revised Privacy Policy terms will mean that you accept and agree to the changes.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-serif font-bold text-primary mb-4">
                8. GDPR Compliance
              </h2>
              <p>
                For users in the European Union, we comply with the General Data Protection Regulation (GDPR). You have the right to access, rectify, or delete your personal data by contacting us at privacy@themyriad.com.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-serif font-bold text-primary mb-4">
                9. Children's Privacy
              </h2>
              <p>
                Our website is not directed to children under 13, and we do not knowingly collect personal information from children under 13. If we become aware that we have collected personal information from a child under 13, we will delete such information and terminate the child's account.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-serif font-bold text-primary mb-4">
                10. Your California Privacy Rights
              </h2>
              <p>
                Under California law, you have the right to request information about the categories of personal information we share with third parties for their direct marketing purposes. To make such a request, please contact us using the information provided in Section 6.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
