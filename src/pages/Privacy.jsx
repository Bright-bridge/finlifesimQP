import { Helmet } from 'react-helmet-async';
import Section from '../components/Section.jsx';

export default function Privacy() {
    return (
        <div className="space-y-5">
            <Helmet>
                <title>Privacy Policy | Financial Life Simulator</title>
                <meta name="description" content="Privacy policy and data usage information." />
            </Helmet>
            <Section><h1 className="text-3xl font-bold">Privacy Policy</h1></Section>
            <Section delay={0.06}>
                <div className="glass rounded-2xl p-4 space-y-3">
                    <p><strong>Effective Date: November 13, 2025</strong></p>

                    <p>Thank you for using this website (hereinafter referred to as “the Website” or “we”). We take your privacy and data security very seriously. This Privacy Policy explains how we collect, use, store, and protect your information.</p>

                    <h2 className="text-xl font-semibold mt-4">1. Information We Collect</h2>
                    <p>We do not collect any personally identifiable information (such as your name, ID number, or contact details).</p>
                    <p>We only collect the following non-personal information when you voluntarily provide it, solely for financial calculations and simulations:</p>
                    <ul className="list-disc ml-5">
                        <li>Current savings amount</li>
                        <li>Monthly or daily spending</li>
                        <li>Monthly income or passive income (optional)</li>
                        <li>Investment return rate (optional)</li>
                    </ul>
                    <p>All data is used only within your current browsing session to generate financial simulations and display results. We do not permanently store your data or transmit it to any third-party servers.</p>

                    <h2 className="text-xl font-semibold mt-4">2. How We Use Your Information</h2>
                    <p>Your data is used solely for:</p>
                    <ul className="list-disc ml-5">
                        <li>Performing financial simulations locally in your browser</li>
                        <li>Displaying visual results and financial predictions</li>
                        <li>Improving website functionality using anonymous aggregated statistics</li>
                    </ul>
                    <p>We do not use your data for advertising, profiling, or sharing with third parties.</p>

                    <h2 className="text-xl font-semibold mt-4">3. Information Storage and Security</h2>
                    <ul className="list-disc ml-5">
                        <li>Your input data is stored temporarily in your browser’s memory or local cache.</li>
                        <li>No data is uploaded to any server.</li>
                        <li>Data is cleared automatically when you refresh or close the page.</li>
                        <li>We do not create user accounts or maintain data profiles.</li>
                    </ul>

                    <h2 className="text-xl font-semibold mt-4">4. Third-Party Services</h2>
                    <p>The Website may use the following third-party services:</p>
                    <ul className="list-disc ml-5">
                        <li>Hosting services (e.g., Vercel, Netlify, GitHub Pages)</li>
                        <li>Anonymous analytics tools (e.g., Google Analytics)</li>
                    </ul>
                    <p>These services help improve performance or collect anonymous visit statistics. They do not access your input data.</p>

                    <h2 className="text-xl font-semibold mt-4">5. Your Rights</h2>
                    <p>Since we do not collect or store personal data, there is no need for data deletion, correction, or export requests. If you have privacy questions, feel free to contact us.</p>

                    <h2 className="text-xl font-semibold mt-4">6. Contact Us</h2>
                    <p>If you have questions, suggestions, or complaints regarding this Privacy Policy, you may contact us:</p>
                    <ul className="list-disc ml-5">
                        <li>Email: <em>[pikiBright1019@outlook.com]</em></li>
                        <li>Website: <em>[https://finlifesim.com]</em></li>
                    </ul>

                    <h2 className="text-xl font-semibold mt-4">7. Updates to This Policy</h2>
                    <p>We may update this Privacy Policy from time to time. The updated version will be posted on this page and will take effect immediately upon publication.</p>
                </div>
            </Section>
        </div>
    );
}