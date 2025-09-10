import React from 'react';
import Layout from './Layout';

const AboutUs: React.FC = () => {
  const doctors = [
    {
      id: 1,
      name: 'Dr. Sarah Smith',
      title: 'Chief Medical Officer',
      specialization: 'Internal Medicine',
      image: '/api/placeholder/300/400',
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
      image: '/api/placeholder/300/400',
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
      image: '/api/placeholder/300/400',
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
      image: '/api/placeholder/300/400',
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
      image: '/api/placeholder/300/400',
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
      image: '/api/placeholder/300/400',
      description: 'Specializing in disorders of the nervous system, Dr. Anderson provides expert care for neurological conditions.',
      education: 'MD - University of Pennsylvania',
      experience: '14+ years',
      languages: ['English']
    }
  ];

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-12 text-white mb-12">
            <h1 className="text-5xl font-bold mb-4">About Our Clinic</h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Dedicated to providing exceptional healthcare with compassion, expertise, and cutting-edge technology.
            </p>
          </div>
        </div>

        {/* Mission Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
            <p className="text-lg text-gray-600 mb-4">
              We are committed to delivering comprehensive, patient-centered healthcare that promotes wellness, 
              prevents illness, and restores health. Our team of dedicated professionals works together to ensure 
              every patient receives personalized care in a comfortable and supportive environment.
            </p>
            <p className="text-lg text-gray-600">
              With state-of-the-art facilities and a focus on continuous innovation, we strive to be the 
              healthcare provider of choice for our community.
            </p>
          </div>
          <div className="bg-gray-200 rounded-lg h-80 flex items-center justify-center">
            <div className="text-center">
              <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 3c1.93 0 3.5 1.57 3.5 3.5S13.93 13 12 13s-3.5-1.57-3.5-3.5S10.07 6 12 6zm7 13H5v-.23c0-.62.28-1.2.76-1.58C7.47 15.82 9.64 15 12 15s4.53.82 6.24 2.19c.48.38.76.97.76 1.58V19z"/>
              </svg>
              <p className="text-gray-500">Clinic Facilities</p>
            </div>
          </div>
        </div>

        {/* Values Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Compassion</h3>
              <p className="text-gray-600">We treat every patient with empathy, respect, and genuine care.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Excellence</h3>
              <p className="text-gray-600">We maintain the highest standards of medical practice and patient care.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Integrity</h3>
              <p className="text-gray-600">We operate with honesty, transparency, and ethical principles.</p>
            </div>
          </div>
        </div>

        {/* Doctors Section */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Meet Our Medical Team</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our experienced and dedicated physicians are committed to providing you with the best possible care.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {doctors.map((doctor) => (
              <div key={doctor.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                {/* Doctor Image */}
                <div className="aspect-w-3 aspect-h-4 bg-gray-200">
                  <div className="w-full h-80 bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                    <svg className="w-20 h-20 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                    </svg>
                  </div>
                </div>
                
                {/* Doctor Info */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{doctor.name}</h3>
                  <p className="text-blue-600 font-medium mb-1">{doctor.title}</p>
                  <p className="text-sm text-gray-500 mb-3">{doctor.specialization}</p>
                  
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {doctor.description}
                  </p>
                  
                  {/* Doctor Details */}
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center">
                      <svg className="w-4 h-4 text-gray-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z"/>
                      </svg>
                      <span className="text-gray-600">{doctor.education}</span>
                    </div>
                    <div className="flex items-center">
                      <svg className="w-4 h-4 text-gray-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-600">{doctor.experience}</span>
                    </div>
                    <div className="flex items-center">
                      <svg className="w-4 h-4 text-gray-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M7 2a1 1 0 011 1v1h3a1 1 0 110 2H9.578a18.87 18.87 0 01-1.724 4.78c.29.354.596.696.914 1.026a1 1 0 11-1.44 1.389c-.188-.196-.373-.396-.554-.6a19.098 19.098 0 01-3.107 3.567 1 1 0 01-1.334-1.49 17.087 17.087 0 003.13-3.733 18.992 18.992 0 01-1.487-2.494 1 1 0 111.79-.89c.234.47.489.928.764 1.372.417-.934.752-1.913.997-2.927H3a1 1 0 110-2h3V3a1 1 0 011-1zm6 6a1 1 0 01.894.553l2.991 5.982a.869.869 0 01.02.037l.99 1.98a1 1 0 11-1.79.895L15.383 16h-4.764l-.724 1.447a1 1 0 11-1.788-.894l.99-1.98.019-.038 2.99-5.982A1 1 0 0113 8zm-1.382 6h2.764L13 11.236 11.618 14z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-600">{doctor.languages.join(', ')}</span>
                    </div>
                  </div>
                  
                  {/* Book Appointment Button */}
                  <button className="w-full mt-4 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors">
                    Book Appointment
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Statistics */}
        <div className="bg-gray-50 rounded-lg p-8 mb-16">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">Our Impact</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">10,000+</div>
              <div className="text-gray-600">Patients Served</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600 mb-2">15+</div>
              <div className="text-gray-600">Years of Service</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600 mb-2">98%</div>
              <div className="text-gray-600">Patient Satisfaction</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-orange-600 mb-2">6</div>
              <div className="text-gray-600">Specialist Doctors</div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AboutUs;