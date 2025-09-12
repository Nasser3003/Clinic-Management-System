package com.clinic.demo.utils;

import com.clinic.demo.models.entity.user.AdminEntity;
import com.clinic.demo.models.entity.user.BaseUserEntity;
import com.clinic.demo.models.entity.user.EmployeeEntity;
import com.clinic.demo.models.entity.user.PatientEntity;

public class Validations {
    public static boolean isValidEmail(String email) {
        return email.matches("^[\\w-_\\.+]*[\\w-_\\.]\\@([\\w]+\\.)+[\\w]+[\\w]$");
    }
    public static boolean isValidPhoneNumber(String phoneNumber) {
        return phoneNumber.matches("^[0-9]{10}$");
    }

    public static boolean isValidPassword(String password) {
        return password.matches("^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=])(?=\\S+$).{8,}$");
    }

    public static boolean isValidName(String name) {
        return name.matches("^[a-zA-Z ]+$");
    }

    public static boolean isInstanceOfEmployee(BaseUserEntity baseUserEntity) {
        return baseUserEntity instanceof EmployeeEntity;
    }
    public static boolean isInstanceOfAdmin(BaseUserEntity baseUserEntity) {
        return baseUserEntity instanceof AdminEntity;
    }
    public static boolean isInstanceOfPatient(BaseUserEntity baseUserEntity) {
        return baseUserEntity instanceof PatientEntity;
    }


}
