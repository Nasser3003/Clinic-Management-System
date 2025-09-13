# Clinic Management System

A comprehensive Spring Boot-based clinic management system designed to streamline healthcare operations, manage patient appointments, and provide secure role-based access control.

## 🏥 Overview

This system provides a complete digital solution for healthcare clinics, offering features for patient management, appointment scheduling, treatment tracking, and administrative operations. Built with Spring Boot and following modern software architecture principles.

## 🚀 Features

### ✅ Implemented Features

#### Authentication & Authorization
- **JWT-based Authentication**: Secure token-based authentication system
- **Role-Based Access Control**: Fine-grained permissions system
- **Multi-User Types**: Support for Patients, Doctors, Nurses, Admins, Receptionists, Lab Technicians, and Partners
- **Password Reset**: Email-based OTP password recovery
- **Two-Factor Authentication**: Email OTP-based 2FA

#### User Management
- **User Registration**: Patient and employee registration systems
- **Profile Management**: Update user profiles with validation
- **Password Management**: Secure password updates with current password verification
- **User Types**: Specialized entities for different user roles

#### Appointment System
- **Appointment Scheduling**: Book appointments with doctors
- **Schedule Management**: Doctor availability and working hours
- **Appointment Completion**: Mark appointments as completed with treatments
- **Calendar Integration**: View appointments in calendar format

#### Calendar & Scheduling
- **Doctor Calendar View**: Comprehensive view of doctor schedules and appointments
- **Patient Calendar View**: Patient appointment history and upcoming appointments
- **Available Time Slots**: Real-time availability checking
- **Time Off Management**: Staff leave and time-off requests

#### Treatment Management
- **Treatment Recording**: Detailed treatment records with financial tracking
- **Payment Tracking**: Monitor payments and outstanding balances
- **Installment Support**: Flexible payment plans

#### Role & Permission System
- **Dynamic Permissions**: Granular permission system with 25+ permission types
- **System Roles**: Pre-defined roles for different user types
- **Custom Roles**: Create and manage custom roles
- **Permission Management**: Add/remove permissions from roles

#### Email Services
- **OTP Delivery**: Email-based OTP for various purposes
- **Notifications**: System notifications and alerts
- **HTML Email Templates**: Rich email formatting

### 🔧 Under Development

#### Notification System
- **SMS Notifications**: Text message alerts and reminders
- **Push Notifications**: Real-time browser notifications
- **Notification Preferences**: User-customizable notification settings
- **Appointment Reminders**: Automated appointment reminder system

#### Advanced Features
- **Medical Records**: Complete patient medical history
- **Lab Integration**: Laboratory test ordering and results
- **Prescription Management**: Digital prescription system
- **Billing System**: Comprehensive billing and invoicing
- **Reporting & Analytics**: System reports and data analytics
- **Document Management**: File attachments and medical documents

#### API Enhancements
- **API Documentation**: Swagger/OpenAPI integration
- **Rate Limiting**: API throttling and security
- **API Versioning**: Version management for API endpoints

## 🛠 Technology Stack

### Backend
- **Framework**: Spring Boot 3.x
- **Security**: Spring Security with JWT
- **Database**: JPA/Hibernate with PostgreSQL/MySQL support
- **Email**: Spring Mail with HTML templates
- **Validation**: Bean Validation (JSR-303)
- **Architecture**: RESTful API design

### Security Features
- **Encryption**: BCrypt password hashing
- **JWT Tokens**: RSA key-based token signing
- **CORS**: Configurable Cross-Origin Resource Sharing
- **Input Validation**: Comprehensive input sanitization

### Development Tools
- **Build Tool**: Maven
- **Code Quality**: Lombok for boilerplate reduction
- **Database Migration**: Spring Data JPA with automatic schema generation

## 📋 Prerequisites

- Java 17 or higher
- Maven 3.6+
- Database (PostgreSQL/MySQL)
- SMTP server for email functionality

## ⚙️ Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd clinic-management-system
```

### 2. Database Configuration
Configure your database connection in `application.properties`:
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/clinic_db
spring.datasource.username=your_username
spring.datasource.password=your_password
spring.jpa.hibernate.ddl-auto=update
```

### 3. Email Configuration
Set up SMTP configuration for email services:
```properties
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=your-email@gmail.com
spring.mail.password=your-app-password
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true
```

### 4. Build & Run
```bash
mvn clean install
mvn spring-boot:run
```

The application will start on `http://localhost:8080`

## 🔐 Default Users

The system comes with pre-configured users for testing:

| Role | Email | Password | Description |
|------|-------|----------|-------------|
| Admin | admin1@gmail.com | Admin1@gmail.com | System administrator |
| Doctor | doctor@gmail.com | doctor | Medical practitioner |
| Patient | abdo.abdo3003@gmail.com | Abdo.abdo3003@gmail.com | Sample patient |

## 🌐 API Endpoints

### Authentication
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `POST /auth/forgot-password` - Password reset request
- `POST /auth/reset-password` - Reset password with OTP
- `POST /auth/two-factor-auth` - 2FA OTP request

### User Management
- `GET /admin/all` - Get all users (Admin only)
- `POST /admin/register-employee` - Register employee (Admin only)
- `GET /admin/email/{email}` - Get user by email
- `PUT /user/update-profile/{userEmail}` - Update user profile
- `PUT /user/change-password` - Change password

### Appointments
- `POST /appointments/schedule` - Schedule appointment
- `POST /appointments/cancel` - Cancel appointment
- `PATCH /appointments/{id}/complete` - Complete appointment

### Calendar
- `GET /calendar/available-slots` - Get available time slots
- `GET /calendar/doctor/{email}` - Doctor calendar view
- `GET /calendar/patient/{email}` - Patient calendar view
- `GET /calendar/available-doctors` - Available doctors for time slot

### Schedules
- `GET /schedules/get-schedule` - Get employee schedule
- `POST /schedules/create-schedule` - Create schedule
- `PATCH /schedules/update-schedule` - Update schedule

### Time Off
- `POST /timeoffs/create` - Create time off request
- `PUT /timeoffs/{id}` - Update time off
- `PUT /timeoffs/{id}/status` - Approve/decline time off
- `DELETE /timeoffs/{id}` - Delete time off
- `GET /timeoffs/employee` - Get employee time offs
- `GET /timeoffs/pending` - Get pending time offs

## 🔒 Security & Permissions

### User Types & Default Permissions

#### Admin
- Full user management
- System configuration
- Report generation and export
- Patient management (limited)

#### Doctor
- Complete patient management
- Full medical records access
- Laboratory test ordering
- Appointment management

#### Nurse
- Patient care management
- Medical records (read/update)
- View lab results
- Appointment updates

#### Patient
- View own medical records
- Schedule appointments
- View own test results
- Manage own profile

#### Receptionist
- Patient registration and updates
- Full appointment scheduling
- Basic reporting access

#### Lab Technician
- View patient context for tests
- Full laboratory result management
- Medical record access (limited)

### Security Features
- Password complexity validation
- Account lockout protection
- JWT token expiration
- Role-based endpoint protection
- Input validation and sanitization

## 📊 Database Schema

### Core Entities
- **BaseUserEntity**: Base user information with audit fields
- **PatientEntity**: Patient-specific data including allergies and health issues
- **EmployeeEntity**: Employee information with salary and department
- **AdminEntity**: Administrative user with system access
- **AppointmentEntity**: Appointment details with doctor-patient relationships
- **TreatmentEntity**: Treatment records with financial tracking
- **ScheduleEntity**: Doctor working schedules
- **TimeOff**: Employee time-off management
- **RoleEntity**: Dynamic role management with permissions

## 🧪 Testing

### Test Users
The system includes pre-configured test data for development and testing purposes.

### Running Tests
```bash
mvn test
```

## 📈 Monitoring & Logging

- Comprehensive logging with SLF4J
- Security event logging
- Database operation monitoring
- Performance tracking (planned)

## 🔄 Development Status

### Recently Completed
- ✅ JWT authentication system
- ✅ Role-based permission system
- ✅ Appointment scheduling
- ✅ Calendar management
- ✅ Time off system
- ✅ Email services
- ✅ Treatment tracking

### In Progress
- 🔄 Notification system enhancements
- 🔄 Medical records module
- 🔄 Lab integration system
- 🔄 Advanced reporting

### Planned Features
- 📋 Mobile app API
- 📋 Integration with external systems
- 📋 Advanced analytics dashboard
- 📋 Telemedicine support
- 📋 Patient portal
- 📋 Billing and insurance integration

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 Configuration

### Application Properties
Key configuration options:
```properties
# Appointment scheduling constraints
appointment.min.hours.in.advance=24
appointment.max.months.in.advance=6

# Security settings
jwt.expiration.minutes=60
security.cors.allowed-origins=*

# Database settings
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=false
```

## 🚨 Known Issues

- Cross-origin configuration currently allows all origins (production security concern)
- Some validation messages could be more user-friendly
- Email templates could be enhanced with better styling

## 📞 Support

For support, please create an issue in the repository or contact the development team.

## 📄 License

This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE.txt) file for details.

### Attribution Requirements
If you use this code in your projects, you must:
- Include the Apache License 2.0 text
- Provide attribution to the original author
- Include a copy of the NOTICE file (if present)
- State any significant changes made to the original code

Example attribution:
```
This software contains code from Clinic Management System
Original author: Abdelnasser Abdrabbo
Licensed under Apache License 2.0
Source: https://github.com/Nasser3003/Clinic-Management-System
```

---

*This system is actively maintained and regularly updated with new features and improvements.*