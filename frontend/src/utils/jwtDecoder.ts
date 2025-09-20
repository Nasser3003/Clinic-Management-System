export interface JWTPayload {
    sub: string; // user ID
    email: string;
    userType: string; // ADMIN, DOCTOR, PATIENT, etc.
    firstName: string;
    lastName: string;
    permissions: string; // Comma-separated permissions
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

export const extractUserRole = (token: string): 'ADMIN' | 'DOCTOR' | 'NURSE' | 'RECEPTIONIST' | 'LAB_TECHNICIAN' | 'EMPLOYEE' | 'PATIENT' => {
    const payload = decodeJWT(token);

    console.log('JWT Payload:', payload);

    // Use userType field directly from the JWT
    if (payload?.userType) {
        const userType = payload.userType.toUpperCase();
        console.log('UserType found:', userType);

        // Map userType to frontend role
        switch (userType) {
            case 'ADMIN':
                return 'ADMIN';
            case 'DOCTOR':
                return 'DOCTOR';
            case 'NURSE':
                return 'NURSE';
            case 'RECEPTIONIST':
                return 'RECEPTIONIST';
            case 'LAB_TECHNICIAN':
                return 'LAB_TECHNICIAN';
            case 'EMPLOYEE':
                return 'EMPLOYEE';
            case 'PATIENT':
                return 'PATIENT';
            default:
                console.log('Unknown userType, defaulting to PATIENT');
                return 'PATIENT';
        }
    }

    console.log('No userType found, defaulting to PATIENT');
    return 'PATIENT';
};

export const extractUserPermissions = (token: string): string[] => {
    const payload = decodeJWT(token);

    if (payload?.permissions) {
        const permissions = payload.permissions;
        console.log('Permissions found:', permissions);

        return permissions.split(',').map(p => p.trim());
    }

    console.log('No permissions found');
    return [];
};

export const hasPermission = (token: string, permission: string): boolean => {
    const permissions = extractUserPermissions(token);
    return permissions.includes(permission);
};

export const hasAnyPermission = (token: string, permissionsToCheck: string[]): boolean => {
    const userPermissions = extractUserPermissions(token);
    return permissionsToCheck.some(permission => userPermissions.includes(permission));
};

export const hasAllPermissions = (token: string, permissionsToCheck: string[]): boolean => {
    const userPermissions = extractUserPermissions(token);
    return permissionsToCheck.every(permission => userPermissions.includes(permission));
};