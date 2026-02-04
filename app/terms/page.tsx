'use client';

export default function TermsPage() {
  return (
    <main className="bg-background">
      <section className="py-16 px-4 bg-muted/30">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-serif font-bold text-primary mb-4">
            Terms & Conditions
          </h1>
          <p className="text-foreground/70">Last updated: January 2024</p>
        </div>
      </section>

      <section className="py-12 px-4 bg-background">
        <div className="max-w-4xl mx-auto prose prose-invert max-w-none">
          <div className="space-y-8 text-foreground/80">
            <div>
              <h2 className="text-2xl font-serif font-bold text-primary mb-4">
                1. Acceptance of Terms
              </h2>
              <p>
                By accessing and using The Myriad Hotel website and services, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-serif font-bold text-primary mb-4">
                2. Use License
              </h2>
              <p>
                Permission is granted to temporarily download one copy of the materials (information or software) on The Myriad Hotel's website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
              </p>
              <ul className="list-disc pl-6 mt-4 space-y-2">
                <li>Modifying or copying the materials</li>
                <li>Using the materials for any commercial purpose or for any public display</li>
                <li>Attempting to decompile or reverse engineer any software contained on the website</li>
                <li>Removing any copyright or other proprietary notations from the materials</li>
                <li>Transferring the materials to another person or "mirroring" the materials on any other server</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-serif font-bold text-primary mb-4">
                3. Disclaimer
              </h2>
              <p>
                The materials on The Myriad Hotel's website are provided "as is". The Myriad Hotel makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-serif font-bold text-primary mb-4">
                4. Limitations
              </h2>
              <p>
                In no event shall The Myriad Hotel or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on The Myriad Hotel's website.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-serif font-bold text-primary mb-4">
                5. Accuracy of Materials
              </h2>
              <p>
                The materials appearing on The Myriad Hotel's website could include technical, typographical, or photographic errors. The Myriad Hotel does not warrant that any of the materials on The Myriad Hotel's website are accurate, complete, or current.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-serif font-bold text-primary mb-4">
                6. Links
              </h2>
              <p>
                The Myriad Hotel has not reviewed all of the sites linked to its website and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by The Myriad Hotel of the site. Use of any such linked website is at the user's own risk.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-serif font-bold text-primary mb-4">
                7. Modifications
              </h2>
              <p>
                The Myriad Hotel may revise these terms of service for its website at any time without notice. By using this website, you are agreeing to be bound by the then current version of these terms of service.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-serif font-bold text-primary mb-4">
                8. Governing Law
              </h2>
              <p>
                These terms and conditions are governed by and construed in accordance with the laws of the jurisdiction in which The Myriad Hotel operates, and you irrevocably submit to the exclusive jurisdiction of the courts in that location.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-serif font-bold text-primary mb-4">
                9. Booking Conditions
              </h2>
              <p>
                Reservations must be made through our official website or authorized booking partners. A valid payment method is required to secure your reservation. Cancellation policies vary by room type and booking date.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-serif font-bold text-primary mb-4">
                10. Contact Information
              </h2>
              <p>
                If you have any questions about these terms and conditions, please contact us at:
              </p>
              <div className="mt-4 bg-muted/30 p-4 rounded">
                <p><strong>The Myriad Hotel</strong></p>
                <p>Email: info@themyriad.com</p>
                <p>Phone: +1 (555) 123-4567</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
