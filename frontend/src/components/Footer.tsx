import React from 'react';
import { useNavigate } from 'react-router-dom';
import './css/footer.css';

function Footer() {
    const navigate = useNavigate();

    const currentYear = new Date().getFullYear();

    const footerLinks = [
        {
            title: 'Information',
            links: [
                { label: 'About Us', path: '/about' },
                { label: 'Contact', path: '/contact' },
                { label: 'Services', path: '/services' },
                { label: 'Privacy Policy', path: '/privacy' },
            ]
        },
        {
            title: 'Quick Links',
            links: [
                { label: 'Book Appointment', path: '/appointments/book' },
                { label: 'Patient Portal', path: '/dashboard' },
                { label: 'Emergency Contact', path: '/emergency' },
                { label: 'FAQs', path: '/faq' },
            ]
        },
        {
            title: 'Contact Info',
            links: [
                { label: '(555) 123-4567', href: 'tel:+15551234567' },
                { label: 'info@clinic.com', href: 'mailto:info@clinic.com' },
                { label: '123 Healthcare St', path: '/contact' },
                { label: 'Mon-Fri: 8AM-6PM', path: '/hours' },
            ]
        }
    ];

    const handleLinkClick = (link: any) => {
        if (link.href) {
            window.open(link.href, '_blank');
        } else if (link.path) {
            navigate(link.path);
        }
    };

    return (
        <footer className="footer">
            <div className="footer-container">
                {/* Footer Main Content */}
                <div className="footer-main">
                    {/* Logo and Description */}
                    <div className="footer-brand">
                        <div className="footer-logo">
                            <img
                                src="/logo-wide.svg"
                                alt="Clinic Logo"
                                className="footer-logo-image"
                            />
                        </div>

                        <div className="footer-social">
                            <button className="social-link" aria-label="Facebook">
                                <svg className="social-icon" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                                </svg>
                            </button>
                            <button className="social-link" aria-label="Twitter">
                                <svg className="social-icon" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                                </svg>
                            </button>
                            <button className="social-link" aria-label="LinkedIn">
                                <svg className="social-icon" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Footer Links */}
                    <div className="footer-links">
                        {footerLinks.map((section, index) => (
                            <div key={index} className="footer-section">
                                <h4 className="footer-section-title">{section.title}</h4>
                                <ul className="footer-section-links">
                                    {section.links.map((link, linkIndex) => (
                                        <li key={linkIndex}>
                                            <button
                                                onClick={() => handleLinkClick(link)}
                                                className="footer-link"
                                            >
                                                {link.label}
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Footer Bottom */}
                <div className="footer-bottom">
                    <div className="footer-bottom-content">
                        <p className="copyright">
                            © {currentYear} Healthcare Clinic. All rights reserved.
                        </p>
                        <div className="footer-bottom-links">
                            <button 
                                onClick={() => navigate('/privacy')}
                                className="footer-bottom-link"
                            >
                                Privacy Policy
                            </button>
                            <button 
                                onClick={() => navigate('/terms')}
                                className="footer-bottom-link"
                            >
                                Terms of Service
                            </button>
                            <button 
                                onClick={() => navigate('/accessibility')}
                                className="footer-bottom-link"
                            >
                                Accessibility
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;