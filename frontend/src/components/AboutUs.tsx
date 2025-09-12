import React from 'react';
import Layout from './Layout';
import './css/AboutUs.css';

function AboutUs() {
    const doctors = [
        {
            id: 1,
            name: 'Dr. Sarah Smith',
            title: 'Chief Medical Officer',
            specialization: 'Internal Medicine',
            description: 'Dr. Smith has over 15 years of experience in internal medicine and leads our medical team with expertise in preventive care and chronic disease management.',
            education: 'MD - Harvard Medical School',
            experience: '15+ years',
            languages: ['English', 'Spanish']
        },
        {
            id: 2,
            name: 'Dr. Michael Johnson',
            title: 'Cardiologist',
            specialization: 'Cardiology',
            description: 'Specialized in cardiovascular health, Dr. Johnson brings cutting-edge treatment approaches and has performed over 1000 cardiac procedures.',
            education: 'MD - Mayo Clinic School of Medicine',
            experience: '12+ years',
            languages: ['English', 'French']
        },
        {
            id: 3,
            name: 'Dr. Emily Wilson',
            title: 'Pediatrician',
            specialization: 'Pediatrics',
            description: 'Dr. Wilson is passionate about children\'s health and development, providing comprehensive care from infancy through adolescence.',
            education: 'MD - Johns Hopkins University',
            experience: '10+ years',
            languages: ['English']
        },
        {
            id: 4,
            name: 'Dr. David Chen',
            title: 'Orthopedic Surgeon',
            specialization: 'Orthopedics',
            description: 'Expert in musculoskeletal conditions, Dr. Chen specializes in sports medicine and joint replacement surgeries.',
            education: 'MD - Stanford University School of Medicine',
            experience: '8+ years',
            languages: ['English', 'Mandarin']
        },
        {
            id: 5,
            name: 'Dr. Lisa Rodriguez',
            title: 'Dermatologist',
            specialization: 'Dermatology',
            description: 'Dr. Rodriguez focuses on both medical and cosmetic dermatology, helping patients achieve healthy and beautiful skin.',
            education: 'MD - UCLA School of Medicine',
            experience: '9+ years',
            languages: ['English', 'Spanish']
        },
        {
            id: 6,
            name: 'Dr. Robert Anderson',
            title: 'Neurologist',
            specialization: 'Neurology',
            description: 'Specializing in disorders of the nervous system, Dr. Anderson provides expert care for neurological conditions.',
            education: 'MD - University of Pennsylvania',
            experience: '14+ years',
            languages: ['English']
        }
    ];

    return (
        <Layout>
            <div className="about-us-page">
                {/* Hero Section */}
                <div className="hero-section">
                    <div className="hero-content">
                        <h1 className="hero-title">About Our Clinic</h1>
                        <p className="hero-subtitle">
                            Dedicated to providing exceptional healthcare with compassion, expertise, and cutting-edge technology.
                        </p>
                    </div>
                </div>

                {/* Mission Section */}
                <div className="mission-section">
                    <div className="mission-content">
                        <h2 className="mission-title">Our Mission</h2>
                        <p className="mission-text">
                            We are committed to delivering comprehensive, patient-centered healthcare that promotes wellness,
                            prevents illness, and restores health. Our team of dedicated professionals works together to ensure
                            every patient receives personalized care in a comfortable and supportive environment.
                        </p>
                        <p className="mission-text">
                            With state-of-the-art facilities and a focus on continuous innovation, we strive to be the
                            healthcare provider of choice for our community.
                        </p>
                    </div>
                    <div className="mission-image">
                        <div className="placeholder-image">
                            <svg className="placeholder-icon" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 3c1.93 0 3.5 1.57 3.5 3.5S13.93 13 12 13s-3.5-1.57-3.5-3.5S10.07 6 12 6zm7 13H5v-.23c0-.62.28-1.2.76-1.58C7.47 15.82 9.64 15 12 15s4.53.82 6.24 2.19c.48.38.76.97.76 1.58V19z"/>
                            </svg>
                            <p className="placeholder-text">Clinic Facilities</p>
                        </div>
                    </div>
                </div>

                {/* Values Section */}
                <div className="values-section">
                    <h2 className="values-title">Our Values</h2>
                    <div className="values-grid">
                        <div className="value-item">
                            <div className="value-icon compassion-icon">
                                <svg className="icon" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <h3 className="value-title">Compassion</h3>
                            <p className="value-description">We treat every patient with empathy, respect, and genuine care.</p>
                        </div>
                        <div className="value-item">
                            <div className="value-icon excellence-icon">
                                <svg className="icon" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <h3 className="value-title">Excellence</h3>
                            <p className="value-description">We maintain the highest standards of medical practice and patient care.</p>
                        </div>
                        <div className="value-item">
                            <div className="value-icon integrity-icon">
                                <svg className="icon" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="value-title">Integrity</h3>
                            <p className="value-description">We operate with honesty, transparency, and ethical principles.</p>
                        </div>
                    </div>
                </div>

                {/* Doctors Section */}
                <div className="doctors-section">
                    <div className="doctors-header">
                        <h2 className="doctors-title">Meet Our Medical Team</h2>
                        <p className="doctors-subtitle">
                            Our experienced and dedicated physicians are committed to providing you with the best possible care.
                        </p>
                    </div>

                    <div className="doctors-grid">
                        {doctors.map((doctor) => (
                            <div key={doctor.id} className="doctor-card">
                                {/* Doctor Image */}
                                <div className="doctor-image">
                                    <svg className="doctor-avatar" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                                    </svg>
                                    <div className="specialization-badge">
                                        <span className="badge-text">{doctor.specialization}</span>
                                    </div>
                                </div>

                                {/* Doctor Info */}
                                <div className="doctor-info">
                                    <div className="doctor-content">
                                        <h3 className="doctor-name">{doctor.name}</h3>
                                        <p className="doctor-title">{doctor.title}</p>

                                        <p className="doctor-description">
                                            {doctor.description}
                                        </p>

                                        {/* Doctor Details */}
                                        <div className="doctor-details">
                                            <div className="detail-item">
                                                <div className="detail-icon education-icon">
                                                    <svg className="detail-svg" fill="currentColor" viewBox="0 0 20 20">
                                                        <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3z"/>
                                                    </svg>
                                                </div>
                                                <span className="detail-text">{doctor.education}</span>
                                            </div>
                                            <div className="detail-item">
                                                <div className="detail-icon experience-icon">
                                                    <svg className="detail-svg" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                                                    </svg>
                                                </div>
                                                <span className="detail-text">{doctor.experience}</span>
                                            </div>
                                            <div className="detail-item">
                                                <div className="detail-icon languages-icon">
                                                    <svg className="detail-svg" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M7 2a1 1 0 011 1v1h3a1 1 0 110 2H9.578a18.87 18.87 0 01-1.724 4.78c.29.354.596.696.914 1.026a1 1 0 11-1.44 1.389c-.188-.196-.373-.396-.554-.6a19.098 19.098 0 01-3.107 3.567 1 1 0 01-1.334-1.49 17.087 17.087 0 003.13-3.733 18.992 18.992 0 01-1.487-2.494 1 1 0 111.79-.89c.234.47.489.928.764 1.372.417-.934.752-1.913.997-2.927H3a1 1 0 110-2h3V3a1 1 0 011-1z" clipRule="evenodd" />
                                                    </svg>
                                                </div>
                                                <span className="detail-text">{doctor.languages.join(', ')}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Book Appointment Button */}
                                    <button className="book-appointment-btn">
                                        Book Appointment
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Statistics */}
                <div className="statistics-section">
                    <h2 className="statistics-title">Our Impact</h2>
                    <div className="statistics-grid">
                        <div className="statistic-item">
                            <div className="statistic-number patients-number">10,000+</div>
                            <div className="statistic-label">Patients Served</div>
                        </div>
                        <div className="statistic-item">
                            <div className="statistic-number years-number">15+</div>
                            <div className="statistic-label">Years of Service</div>
                        </div>
                        <div className="statistic-item">
                            <div className="statistic-number satisfaction-number">98%</div>
                            <div className="statistic-label">Patient Satisfaction</div>
                        </div>
                        <div className="statistic-item">
                            <div className="statistic-number doctors-number">6</div>
                            <div className="statistic-label">Specialist Doctors</div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}

export default AboutUs;