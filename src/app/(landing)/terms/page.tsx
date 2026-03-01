import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: "Terms and Conditions for using 90percent.",
};

const Terms = () => {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-10">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-app-secondary">
          Terms &amp; Conditions
        </h1>
        <p className="mt-2 text-sm text-gray-500">Last updated: March 1, 2026</p>
      </div>

      <div className="flex flex-col gap-8 text-[15px] leading-relaxed text-gray-600">
        <section>
          <h2 className="mb-3 text-lg font-semibold text-app-secondary">
            1. Acceptance of Terms
          </h2>
          <p>
            By accessing and using 90percent (&quot;the Service&quot;), including
            the website at{" "}
            <a
              href="https://90percent.app"
              className="text-app-primary hover:underline"
            >
              https://90percent.app
            </a>{" "}
            and the 90percent mobile application available on the Apple App Store
            and Google Play Store, you accept and agree to be bound by these
            Terms and Conditions. If you do not agree to these terms, please do
            not use the Service.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-semibold text-app-secondary">
            2. Description of Service
          </h2>
          <p>
            90percent is an educational platform that provides past examination
            questions, AI-powered explanations, CBT practice tools, mock exams,
            study planners, and related learning resources to help students
            prepare for JAMB, Post-UTME, WAEC, NECO, and other examinations. The
            Service is available via the Website and the mobile Application.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-semibold text-app-secondary">
            3. User Accounts
          </h2>
          <p className="mb-2">
            When you create an account with us, you must provide accurate and
            complete information. You are responsible for:
          </p>
          <ul className="ml-5 list-disc space-y-1.5">
            <li>Maintaining the security of your account credentials</li>
            <li>All activities that occur under your account</li>
            <li>Notifying us immediately of any unauthorized use</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-semibold text-app-secondary">
            4. Acceptable Use
          </h2>
          <p className="mb-2">You agree not to:</p>
          <ul className="ml-5 list-disc space-y-1.5">
            <li>
              Use the Service for any unlawful purpose or in violation of any
              applicable laws
            </li>
            <li>
              Copy, reproduce, distribute, or create derivative works from our
              content without permission
            </li>
            <li>
              Attempt to gain unauthorized access to our systems or other
              users&apos; accounts
            </li>
            <li>
              Upload or transmit viruses, malware, or any harmful code
            </li>
            <li>
              Use automated tools to scrape, crawl, or extract data from the
              Service
            </li>
            <li>
              Harass, abuse, or harm other users of the Service
            </li>
          </ul>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-semibold text-app-secondary">
            5. Subscriptions and Payments
          </h2>
          <p className="mb-2">
            Certain features of the Service may require a paid subscription. If
            you purchase a subscription:
          </p>
          <ul className="ml-5 list-disc space-y-1.5">
            <li>
              Payment will be charged to your chosen payment method (including
              Apple App Store or Google Play Store billing) at confirmation of
              purchase.
            </li>
            <li>
              Subscriptions automatically renew unless auto-renew is turned off
              at least 24 hours before the end of the current period.
            </li>
            <li>
              You can manage and cancel subscriptions through your device&apos;s
              app store settings or your account settings on the Website.
            </li>
            <li>
              Refunds are subject to the refund policies of the Apple App Store
              or Google Play Store for in-app purchases, or our own refund policy
              for web purchases.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-semibold text-app-secondary">
            6. Advertising
          </h2>
          <p>
            The Service may display advertisements provided by third-party
            advertising networks, including Google AdSense and Google AdMob.
            These advertisements may be targeted based on your usage of the
            Service and other information. By using the Service, you agree that
            we may display such advertisements. You can manage your advertising
            preferences through your device settings or browser settings as
            described in our Privacy Policy.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-semibold text-app-secondary">
            7. Intellectual Property
          </h2>
          <p>
            All content on the Service, including but not limited to text,
            graphics, logos, icons, images, audio clips, and software, is the
            property of 90percent or its content suppliers and is protected by
            Nigerian and international copyright laws. You may not reproduce,
            modify, or distribute any content without our prior written consent.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-semibold text-app-secondary">
            8. User-Generated Content
          </h2>
          <p>
            By posting content on the Service (including feeds, comments, and
            forum posts), you grant 90percent a non-exclusive, royalty-free,
            worldwide licence to use, display, and distribute such content in
            connection with the Service. You retain ownership of your content but
            are responsible for ensuring it does not violate any third-party
            rights.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-semibold text-app-secondary">
            9. Disclaimers
          </h2>
          <p>
            The Service is provided on an &quot;as is&quot; and &quot;as
            available&quot; basis. We make no warranties, express or implied,
            regarding the accuracy, completeness, or reliability of any content
            or materials on the Service. While we strive to provide accurate
            examination questions and explanations, we do not guarantee exam
            success or results.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-semibold text-app-secondary">
            10. Limitation of Liability
          </h2>
          <p>
            To the maximum extent permitted by law, 90percent shall not be
            liable for any indirect, incidental, special, consequential, or
            punitive damages arising out of or relating to your use of or
            inability to use the Service.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-semibold text-app-secondary">
            11. Termination
          </h2>
          <p>
            We reserve the right to suspend or terminate your account and access
            to the Service at our sole discretion, without notice, for conduct
            that we believe violates these Terms or is harmful to other users,
            us, or third parties, or for any other reason.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-semibold text-app-secondary">
            12. Changes to Terms
          </h2>
          <p>
            We may update these Terms from time to time. We will notify you of
            significant changes by posting a notice on the Service. Your
            continued use of the Service after changes are posted constitutes
            your acceptance of the updated Terms.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-semibold text-app-secondary">
            13. Governing Law
          </h2>
          <p>
            These Terms shall be governed by and construed in accordance with the
            laws of the Federal Republic of Nigeria, without regard to its
            conflict of law provisions.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-semibold text-app-secondary">
            14. Contact Us
          </h2>
          <p>
            If you have any questions about these Terms &amp; Conditions, you can
            contact us at:{" "}
            <a
              href="mailto:passpadi.com@gmail.com"
              className="font-medium text-app-primary hover:underline"
            >
              passpadi.com@gmail.com
            </a>
          </p>
        </section>
      </div>
    </div>
  );
};

export default Terms;
