import React, { useState } from 'react';
import Layout from './Layout';
import './css/Contact.css';

function Contact() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));

        setSubmitted(true);
        setIsSubmitting(false);
        setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    };

    return (
        <Layout>
            <div className="contact-page">
                {/* Header */}
                <div className="contact-header">
                    <h1 className="contact-title">Contact Us</h1>
                    <p className="contact-subtitle">
                        Get in touch with our medical team. We're here to help with your healthcare needs.
                    </p>
                </div>

                <div className="contact-grid">
                    {/* Contact Information */}
                    <div className="contact-info-section">
                        <h2 className="section-title">Get in Touch</h2>
                        <div className="contact-info-list">
                            {/* Phone */}
                            <div className="contact-item">
                                <div className="contact-icon-wrapper">
                                    <div className="contact-icon phone-icon">
                                        <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                        </svg>
                                    </div>
                                </div>
                                <div className="contact-details">
                                    <h3 className="contact-type">Phone</h3>
                                    <p className="contact-value">
                                        Main: (555) 123-4567<br />
                                        Emergency: (555) 911-HELP
                                    </p>
                                </div>
                            </div>

                            {/* Email */}
                            <div className="contact-item">
                                <div className="contact-icon-wrapper">
                                    <div className="contact-icon email-icon">
                                        <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                </div>
                                <div className="contact-details">
                                    <h3 className="contact-type">Email</h3>
                                    <p className="contact-value">
                                        info@clinic.com<br />
                                        appointments@clinic.com
                                    </p>
                                </div>
                            </div>

                            {/* Address */}
                            <div className="contact-item">
                                <div className="contact-icon-wrapper">
                                    <div className="contact-icon location-icon">
                                        <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                    </div>
                                </div>
                                <div className="contact-details">
                                    <h3 className="contact-type">Address</h3>
                                    <p className="contact-value">
                                        123 Healthcare Drive<br />
                                        Medical Center, MC 12345<br />
                                        United States
                                    </p>
                                </div>
                            </div>

                            {/* Hours */}
                            <div className="contact-item">
                                <div className="contact-icon-wrapper">
                                    <div className="contact-icon hours-icon">
                                        <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                </div>
                                <div className="contact-details">
                                    <h3 className="contact-type">Hours</h3>
                                    <p className="contact-value">
                                        Mon-Fri: 8:00 AM - 6:00 PM<br />
                                        Sat: 9:00 AM - 4:00 PM<br />
                                        Sun: Emergency Only
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Map Placeholder */}
                        <div className="map-placeholder">
                            <div className="map-content">
                                <svg className="map-icon" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                                </svg>
                                <p className="map-title">Interactive Map</p>
                                <p className="map-subtitle">View our location</p>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="contact-form-section">
                        <h2 className="section-title">Send us a Message</h2>

                        {submitted ? (
                            <div className="success-message">
                                <div className="success-icon">
                                    <svg className="checkmark" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <h3 className="success-title">Message Sent!</h3>
                                <p className="success-text">Thank you for contacting us. We'll get back to you soon.</p>
                                <button
                                    onClick={() => setSubmitted(false)}
                                    className="another-message-btn"
                                >
                                    Send another message
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="contact-form">
                                <div className="form-row">
                                    <div className="form-group">
                                        <label htmlFor="name" className="form-label">Name *</label>
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                            className="form-input primary-input"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="email" className="form-label">Email *</label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                            className="form-input primary-input"
                                        />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="phone" className="form-label">Phone</label>
                                    <input
                                        type="tel"
                                        id="phone"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className="form-input"
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="subject" className="form-label">Subject *</label>
                                    <input
                                        type="text"
                                        id="subject"
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        required
                                        className="form-input"
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="message" className="form-label">Message *</label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        rows={5}
                                        value={formData.message}
                                        onChange={handleChange}
                                        required
                                        className="form-textarea"
                                        placeholder="Tell us how we can help..."
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="submit-btn"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <svg className="loading-spinner" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="spinner-track" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="spinner-fill" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Sending...
                                        </>
                                    ) : (
                                        'Send Message'
                                    )}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </Layout>
    );
}

export default Contact;