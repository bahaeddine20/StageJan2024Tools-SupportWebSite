package com.bezkoder.springjwt.models;
import javax.validation.Constraint;
import javax.validation.Payload;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Constraint(validatedBy = TimeRangeValidator.class)
@Target({ ElementType.FIELD })
@Retention(RetentionPolicy.RUNTIME)
public @interface TimeRange {
    String message() default "Time must be between 09:00 and 17:00";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}