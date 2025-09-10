export interface JWTPayload {
  sub: string; // email
  roles?: string | string[]; // Can be string or array
  authorities?: string | string[]; // Can be string or array
  role?: string; // single role field
  exp: number;
  iat: number;
  [key: string]: any; // Allow additional fields
}

export const decodeJWT = (token: string): JWTPayload | null => {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    
    const payload = parts[1];
    const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(decoded);
  } catch (error) {
    console.error('Failed to decode JWT:', error);
    return null;
  }
};

export const extractUserRole = (token: string): 'ADMIN' | 'EMPLOYEE' | 'PATIENT' => {
  const payload = decodeJWT(token);
  
  console.log('JWT Payload:', payload); // Debug log to see actual structure
  
  // Your backend stores roles as a space-separated string in the 'roles' claim
  if (payload?.roles) {
    const roles = payload.roles;
    console.log('Roles found:', roles, 'Type:', typeof roles);
    
    if (typeof roles === 'string') {
      // Check for admin roles
      if (roles.includes('ADMIN') || roles.includes('ROLE_ADMIN')) {
        return 'ADMIN';
      }
      
      // Check for employee/doctor roles  
      if (roles.includes('EMPLOYEE') || roles.includes('ROLE_EMPLOYEE') || 
          roles.includes('DOCTOR') || roles.includes('ROLE_DOCTOR')) {
        return 'EMPLOYEE';
      }
      
      // Check for patient roles
      if (roles.includes('PATIENT') || roles.includes('ROLE_PATIENT')) {
        return 'PATIENT';
      }
    } else if (Array.isArray(roles)) {
      // Fallback: check if roles is an array
      if (roles.includes('ADMIN') || roles.includes('ROLE_ADMIN')) return 'ADMIN';
      if (roles.includes('EMPLOYEE') || roles.includes('ROLE_EMPLOYEE') || 
          roles.includes('DOCTOR') || roles.includes('ROLE_DOCTOR')) return 'EMPLOYEE';
      if (roles.includes('PATIENT') || roles.includes('ROLE_PATIENT')) return 'PATIENT';
    }
  }
  
  // Check authorities field as fallback
  if (payload?.authorities) {
    const authorities = payload.authorities;
    console.log('Authorities found:', authorities, 'Type:', typeof authorities);
    
    if (typeof authorities === 'string') {
      if (authorities.includes('ADMIN') || authorities.includes('ROLE_ADMIN')) return 'ADMIN';
      if (authorities.includes('EMPLOYEE') || authorities.includes('ROLE_EMPLOYEE') || 
          authorities.includes('DOCTOR') || authorities.includes('ROLE_DOCTOR')) return 'EMPLOYEE';
      if (authorities.includes('PATIENT') || authorities.includes('ROLE_PATIENT')) return 'PATIENT';
    } else if (Array.isArray(authorities)) {
      if (authorities.includes('ADMIN') || authorities.includes('ROLE_ADMIN')) return 'ADMIN';
      if (authorities.includes('EMPLOYEE') || authorities.includes('ROLE_EMPLOYEE') || 
          authorities.includes('DOCTOR') || authorities.includes('ROLE_DOCTOR')) return 'EMPLOYEE';
      if (authorities.includes('PATIENT') || authorities.includes('ROLE_PATIENT')) return 'PATIENT';
    }
  }
  
  console.log('No role found, defaulting to PATIENT');
  return 'PATIENT'; // default
};