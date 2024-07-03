package com.bezkoder.springjwt.models;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;
import java.text.SimpleDateFormat;
import java.util.Date;

public class TimeRangeValidator implements ConstraintValidator<TimeRange, Date> {

    private static final SimpleDateFormat hourMinuteFormat = new SimpleDateFormat("HH:mm");

    @Override
    public void initialize(TimeRange constraintAnnotation) {
    }

    @Override
    public boolean isValid(Date value, ConstraintValidatorContext context) {
        if (value == null) {
            return false;
        }

        try {
            Date startTime = hourMinuteFormat.parse("09:00");
            Date endTime = hourMinuteFormat.parse("17:00");
            Date time = hourMinuteFormat.parse(hourMinuteFormat.format(value));

            return !time.before(startTime) && !time.after(endTime);
        } catch (Exception e) {
            return false;
        }
    }
}
