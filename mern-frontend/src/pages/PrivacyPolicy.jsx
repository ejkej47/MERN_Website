// src/pages/PrivacyPolicy.jsx
export default function PrivacyPolicy() {
  return (
    <main className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-2">Privacy Policy</h1>
      <p className="text-sm text-gray-500 mb-6">Effective date: August 13, 2025</p>

      <p className="mb-4">
        We respect your privacy and are committed to protecting your personal data.
        This Privacy Policy explains how we collect, use, and safeguard your information
        when you use our website and services.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">Information We Collect</h2>
      <ul className="list-disc pl-6 space-y-1">
        <li><strong>Account Information:</strong> Email, password (hashed), and profile data.</li>
        <li><strong>Third-Party Login Data:</strong> If you log in with Facebook or Google, we may receive your name, email address, and profile picture from these providers.</li>
        <li><strong>Usage Data:</strong> Information on how you interact with our website (pages visited, actions taken).</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2">How We Use Your Information</h2>
      <ul className="list-disc pl-6 space-y-1">
        <li>To provide and manage your account.</li>
        <li>To enable login through Facebook or Google.</li>
        <li>To improve our website and services.</li>
        <li>To communicate with you regarding your account or our services.</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2">Sharing of Data</h2>
      <p className="mb-4">
        We do not sell your personal data. We may share it only in the following cases:
      </p>
      <ul className="list-disc pl-6 space-y-1">
        <li>With service providers who help us operate our website.</li>
        <li>When required by law or to protect our rights.</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2">Data Retention</h2>
      <p className="mb-4">
        We store your information for as long as your account is active, or as needed to provide our services.
        You may request deletion of your account at any time.
      </p>

      <h2 id="data-deletion" className="text-xl font-semibold mt-6 mb-2">Data Deletion</h2>
      <p className="mb-4">
        You can request deletion of your personal data by contacting us at:
        {" "}
        <a className="underline" href="mailto:your@email.com">
          your@email.com
        </a>.
        {" "}
        Alternatively, if you logged in using Facebook, you can initiate deletion via your Facebook account settings.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">Changes to This Policy</h2>
      <p className="mb-4">
        We may update this Privacy Policy from time to time. The latest version will always be posted on this page.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">Contact</h2>
      <p>
        If you have any questions about this Privacy Policy, contact us at:
        {" "}
        <a className="underline" href="mailto:your@email.com">
          your@email.com
        </a>
      </p>
    </main>
  );
}
