import { Helmet } from 'react-helmet-async';
import Section from '../components/Section.jsx';

export default function Contact() {
    return (
        <div className="space-y-5">
            <Helmet>
                <title>Contact Us | Financial Life Simulator</title>
                <meta name="description" content="Contact and feedback channels." />
            </Helmet>
            <Section><h1 className="text-3xl font-bold">Contact Us</h1></Section>
            <Section delay={0.06}>
                <div className="glass rounded-2xl p-4 space-y-3">
                    <p className="text-slate-300">For feedback or collaboration inquiries, please email: pikibright1019@outlook.com.</p>
                    <p className="text-slate-300">We welcome suggestions regarding accessibility, compliance, and performance.</p>
                </div>
            </Section>
        </div>
    );
}
