package com.almoatasem.demo.utils;

import java.sql.Date;
import java.time.LocalDate;

public class DateManipulation {
    public static java.sql.Date parseDate(String date) {
        java.sql.Date parsed = Date.valueOf(LocalDate.parse(date));
        return parsed;
    }
}
