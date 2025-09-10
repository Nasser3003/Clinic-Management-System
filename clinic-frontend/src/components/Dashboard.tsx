import React from 'react';
import { useAuth } from '../context/AuthContext';
import Layout from './Layout';

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  const renderDashboardContent = () => {
    switch (user?.role) {
      case 'ADMIN':
        return <AdminDashboard />;
      case 'EMPLOYEE':
        return <EmployeeDashboard />;
      case 'PATIENT':
        return <PatientDashboard />;
      default:
        return <div>Unknown user role</div>;
    }
  };

  return (
    <Layout>
      {renderDashboardContent()}
    </Layout>
  );
};

const AdminDashboard: React.FC = () => (
  <div className="space-y-6">
    <h2 className="text-2xl font-bold text-gray-900">Admin Dashboard</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <DashboardCard
        title="Total Appointments"
        value="150"
        description="This month"
        color="bg-blue-500"
      />
      <DashboardCard
        title="Active Employees"
        value="12"
        description="Currently working"
        color="bg-green-500"
      />
      <DashboardCard
        title="Pending Time-offs"
        value="5"
        description="Awaiting approval"
        color="bg-yellow-500"
      />
    </div>
  </div>
);

const EmployeeDashboard: React.FC = () => (
  <div className="space-y-6">
    <h2 className="text-2xl font-bold text-gray-900">Employee Dashboard</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <DashboardCard
        title="Today's Appointments"
        value="8"
        description="Scheduled for today"
        color="bg-blue-500"
      />
      <DashboardCard
        title="This Week's Schedule"
        value="32"
        description="Total appointments"
        color="bg-green-500"
      />
    </div>
  </div>
);

const PatientDashboard: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Welcome Section with Background */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white shadow-xl border border-blue-500/20">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.firstName}!</h1>
            <p className="text-blue-100">Manage your health appointments and medical records</p>
          </div>
          <div className="hidden md:block">
            <div className="w-24 h-24 bg-white bg-opacity-10 rounded-full flex items-center justify-center">
              <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 3c1.93 0 3.5 1.57 3.5 3.5S13.93 13 12 13s-3.5-1.57-3.5-3.5S10.07 6 12 6zm7 13H5v-.23c0-.62.28-1.2.76-1.58C7.47 15.82 9.64 15 12 15s4.53.82 6.24 2.19c.48.38.76.97.76 1.58V19z"/>
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <DashboardCard
          title="Next Appointment"
          value="Tomorrow"
          description="10:30 AM with Dr. Smith"
          color="bg-blue-500"
        />
        <DashboardCard
          title="Past Visits"
          value="12"
          description="Completed appointments"
          color="bg-green-500"
        />
        <DashboardCard
          title="Upcoming Visits"
          value="3"
          description="Scheduled appointments"
          color="bg-purple-500"
        />
      </div>

      {/* Previous Visits Section */}
      <div className="bg-white shadow-xl rounded-2xl border border-gray-200 overflow-hidden">
        <div className="px-8 py-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
          <h3 className="text-xl font-bold text-gray-900">Previous Visits</h3>
          <p className="text-sm text-gray-600 mt-1">Your completed medical appointments</p>
        </div>
        <div className="p-8">
          <div className="space-y-4">
            {[
              { date: '2024-01-15', doctor: 'Dr. Smith', type: 'Check-up', status: 'Completed' },
              { date: '2023-12-10', doctor: 'Dr. Johnson', type: 'Follow-up', status: 'Completed' },
              { date: '2023-11-05', doctor: 'Dr. Smith', type: 'Consultation', status: 'Completed' },
            ].map((visit, index) => (
              <div key={index} className="flex items-center justify-between p-6 bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl border border-gray-200 hover:shadow-lg transition-all duration-300 hover:border-gray-300">
                <div className="flex items-center space-x-6">
                  <div className="flex-shrink-0">
                    <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center border border-green-200">
                      <svg className="w-7 h-7 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <p className="text-base font-semibold text-gray-900">{visit.type} with {visit.doctor}</p>
                    <p className="text-sm text-gray-500 mt-1">{new Date(visit.date).toLocaleDateString()}</p>
                  </div>
                </div>
                <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-green-100 text-green-800 border border-green-200">
                  {visit.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Future Visits Section */}
      <div className="bg-white shadow-xl rounded-2xl border border-gray-200 overflow-hidden">
        <div className="px-8 py-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <h3 className="text-xl font-bold text-gray-900">Upcoming Visits</h3>
          <p className="text-sm text-gray-600 mt-1">Your scheduled medical appointments</p>
        </div>
        <div className="p-8">
          <div className="space-y-4">
            {[
              { date: '2024-02-15', doctor: 'Dr. Smith', type: 'Annual Check-up', time: '10:30 AM' },
              { date: '2024-03-10', doctor: 'Dr. Johnson', type: 'Follow-up', time: '2:00 PM' },
              { date: '2024-04-05', doctor: 'Dr. Wilson', type: 'Consultation', time: '9:00 AM' },
            ].map((visit, index) => (
              <div key={index} className="flex items-center justify-between p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-200 hover:shadow-lg transition-all duration-300 hover:border-blue-300">
                <div className="flex items-center space-x-6">
                  <div className="flex-shrink-0">
                    <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center border border-blue-200">
                      <svg className="w-7 h-7 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <p className="text-base font-semibold text-gray-900">{visit.type} with {visit.doctor}</p>
                    <p className="text-sm text-gray-500 mt-1">{new Date(visit.date).toLocaleDateString()} at {visit.time}</p>
                  </div>
                </div>
                <button className="inline-flex items-center px-6 py-3 border border-blue-300 text-sm font-medium rounded-full text-blue-700 bg-gradient-to-r from-blue-50 to-purple-50 hover:from-blue-100 hover:to-purple-100 transition-all duration-200 hover:shadow-lg shadow-sm">
                  View Details
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

interface DashboardCardProps {
  title: string;
  value: string;
  description: string;
  color: string;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ title, value, description, color }) => (
  <div className="bg-white overflow-hidden shadow-xl rounded-2xl border border-gray-200 hover:shadow-2xl transition-all duration-300 hover:border-gray-300">
    <div className="p-6">
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <div className={`w-12 h-12 rounded-2xl ${color} flex items-center justify-center border border-opacity-20 border-white`}>
            <div className="w-6 h-6 bg-white bg-opacity-20 rounded-full"></div>
          </div>
        </div>
        <div className="ml-6 w-0 flex-1">
          <dl>
            <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
            <dd className="text-2xl font-bold text-gray-900 mt-1">{value}</dd>
            <dd className="text-sm text-gray-500 mt-1">{description}</dd>
          </dl>
        </div>
      </div>
    </div>
  </div>
);

export default Dashboard;