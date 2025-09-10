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

const PatientDashboard: React.FC = () => (
  <div className="space-y-6">
    <h2 className="text-2xl font-bold text-gray-900">Patient Dashboard</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <DashboardCard
        title="Next Appointment"
        value="Tomorrow"
        description="10:30 AM with Dr. Smith"
        color="bg-blue-500"
      />
      <DashboardCard
        title="Medical History"
        value="3"
        description="Past appointments"
        color="bg-purple-500"
      />
    </div>
  </div>
);

interface DashboardCardProps {
  title: string;
  value: string;
  description: string;
  color: string;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ title, value, description, color }) => (
  <div className="bg-white overflow-hidden shadow rounded-lg">
    <div className="p-5">
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <div className={`w-8 h-8 rounded-full ${color}`}></div>
        </div>
        <div className="ml-5 w-0 flex-1">
          <dl>
            <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
            <dd className="text-lg font-medium text-gray-900">{value}</dd>
            <dd className="text-sm text-gray-500">{description}</dd>
          </dl>
        </div>
      </div>
    </div>
  </div>
);

export default Dashboard;