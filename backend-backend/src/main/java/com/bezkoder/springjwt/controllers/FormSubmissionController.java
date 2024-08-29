package com.bezkoder.springjwt.controllers;

import com.bezkoder.springjwt.models.*;
import com.bezkoder.springjwt.repository.AuthorizationRequestRepository;
import com.bezkoder.springjwt.repository.RequestRepository;
import com.bezkoder.springjwt.security.services.EmailService;

import com.bezkoder.springjwt.security.services.TeamService;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.time.YearMonth;
import java.util.*;

@CrossOrigin(origins = "*") // Allow requests from Angular frontend
@RestController
public class FormSubmissionController {

    @Autowired
    private EmailService emailSenderService;

    @Autowired
    private RequestRepository requestRepository;
    @Autowired
    private TeamService teamService;
    @Autowired
    private AuthorizationRequestRepository authorizationRequestRepository;

    @PostMapping("/submitForm")
    public ResponseEntity<?> handleSubmitForm(@RequestBody FormSubmissionDTO formSubmission) {
        try {
            SimpleDateFormat dateFormat = new SimpleDateFormat("dd-MM-yyyy");

            // Format dates
            String formattedStartDate = dateFormat.format(formSubmission.getStartDate());
            String formattedEndDate = dateFormat.format(formSubmission.getEndDate());

            // Create and save the request to the database
            Request request = new Request();
            request.setName(formSubmission.getName());
            request.setEmployeeEmail(formSubmission.getEmployeeEmail());
            request.setStartDate(formSubmission.getStartDate());
            request.setEndDate(formSubmission.getEndDate());
            request.setReason(formSubmission.getReason());
            request.setStatus("Pending"); // Assuming default status
            requestRepository.save(request);

            // Prepare and send an email notification
            String emailMessage = String.format("Dear Admin,\n\n" +
                            "A leave request has been submitted with the following details:\n\n" +
                            "Name: %s\n" +
                            "Start Date: %s\n" +
                            "End Date: %s\n" +
                            "Employee Email: %s\n" +
                            "Reason: %s\n\n" +
                            "Please take appropriate action.\n\n" +
                            "Sincerely,\nYour Application",
                    request.getName(), formattedStartDate, formattedEndDate, request.getEmployeeEmail(), request.getReason());

            emailSenderService.sendLeaveRequestEmail(formSubmission.getAdminEmail(), emailMessage);

            // Response
            return ResponseEntity.ok().contentType(MediaType.APPLICATION_JSON)
                    .body("{\"message\": \"Form submitted and email sent successfully!\"}");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body("{\"error\": \"Failed to send email due to an internal error.\"}");
        }
    }
    // Get all requests
    @GetMapping("/getRequests")
    public ResponseEntity<List<Request>> getAllRequests() {
        List<Request> requests = requestRepository.findAll();
        return ResponseEntity.ok(requests);
    }

    // Accept a request
    @PostMapping("/acceptRequest")
    public ResponseEntity<String> acceptRequest(@RequestParam Long id) {
        return updateRequestStatus(id, "Accepted");
    }

    @PostMapping("/rejectRequest")
    public ResponseEntity<String> rejectRequest(@RequestParam Long id) {
        return updateRequestStatus(id, "Rejected");
    }

    private ResponseEntity<String> updateRequestStatus(Long id, String status) {
        Optional<Request> optionalRequest = requestRepository.findById(id);
        if (!optionalRequest.isPresent()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Request not found.");
        }

        Request request = optionalRequest.get();
        request.setStatus(status);
        requestRepository.save(request);

        if ("Accepted".equals(status)) {
            emailSenderService.sendApprovalEmail(request.getEmployeeEmail(), request.getName());
        } else if ("Rejected".equals(status)) {
            emailSenderService.sendRejectionEmail(request.getEmployeeEmail(), request.getName());
        }

        return ResponseEntity.ok("Request " + status.toLowerCase() + " successfully.");
    }
    @DeleteMapping("/deleteRequestById/{id}")
    public boolean deleteRequestByID(@PathVariable("id") int id) {
        return emailSenderService.deleteRequestByID(id);
    }

    @DeleteMapping("/deleteAllRequests")
    public ResponseEntity<?> deleteAllRequests() {
        emailSenderService.deleteAllRequests();
        return ResponseEntity.ok().body("{\"message\": \"All requests have been deleted successfully.\"}");
    }
    @DeleteMapping("/deleteRequests")
    public ResponseEntity<?> deleteMultipleRequests(@RequestBody List<Long> ids) {
        emailSenderService.deleteMultipleRequests(ids);
        return ResponseEntity.ok().body("{\"message\": \"Selected requests have been deleted successfully.\"}");
    }
    @PostMapping("/submitAuthorizationRequest")
    public ResponseEntity<?> submitAuthorizationRequest(@RequestBody AuthorizationRequest authorizationRequest) {
        try {
            // Save the authorization request to the database
            authorizationRequest.setStatus("pending"); // Set initial status as pending
            authorizationRequestRepository.save(authorizationRequest);

            // Prepare and send an email notification
            String emailMessage = String.format("Dear Admin,\n\n" +
                            "An authorization request has been submitted with the following details:\n\n" +
                            "Requester Name: %s\n" +
                            "Requester Email: %s\n" +
                            "Reason: %s\n" +
                            "Leaving Time: %s\n\n" +
                            "Please take appropriate action.\n\n" +
                            "Sincerely,\nYour Application",
                    authorizationRequest.getRequesterName(), authorizationRequest.getRequesterEmail(),
                    authorizationRequest.getReason(), authorizationRequest.getLeavingTime());

            //emailSenderService.sendAuthorizationRequestEmail(authorizationRequest.getAdminEmail(), emailMessage);

            // Response
            System.out.println("Authorization request submitted and email sent successfully!");
            return ResponseEntity.ok().contentType(MediaType.APPLICATION_JSON)
                    .body("{\"message\": \"Authorization request submitted and email sent successfully!\"}");
        } catch (Exception e) {
            System.err.println("Failed to process authorization request: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body("{\"error\": \"Failed to send email due to an internal error.\"}");
        }
    }
    // Accept an authorization request
    @PostMapping("/acceptAuthorizationRequest")
    public ResponseEntity<String> acceptAuthorizationRequest(@RequestParam Long id) {
        return updateAuthorizationRequestStatus(id, "Accepted"); // Appel de la méthode avec le statut "approved"
    }

    // Rejeter une demande d'autorisation
    @PostMapping("/rejectAuthorizationRequest")
    public ResponseEntity<String> rejectAuthorizationRequest(@RequestParam Long id) {
        return updateAuthorizationRequestStatus(id, "Rejected"); // Appel de la méthode avec le statut "rejected"
    }

    // Méthode pour mettre à jour le statut de la demande d'autorisation
    private ResponseEntity<String> updateAuthorizationRequestStatus(Long id, String status) {
        Optional<AuthorizationRequest> optionalAuthorizationRequest = authorizationRequestRepository.findById(id);
        if (!optionalAuthorizationRequest.isPresent()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Authorization request not found.");
        }

        AuthorizationRequest authorizationRequest = optionalAuthorizationRequest.get();
        authorizationRequest.setStatus(status); // Définir le statut
        authorizationRequestRepository.save(authorizationRequest);

        // Envoyer une notification par e-mail au demandeur concernant l'approbation ou le rejet
        if ("approved".equals(status)) {
            emailSenderService.sendApprovalEmail(authorizationRequest.getRequesterEmail(), authorizationRequest.getRequesterName());
        } else if ("rejected".equals(status)) {
            emailSenderService.sendRejectionEmail(authorizationRequest.getRequesterEmail(), authorizationRequest.getRequesterName());
        }

        return ResponseEntity.ok("Authorization request " + status + " successfully.");
    }

    // Get all authorization requests
    @GetMapping("/getAuthorizationRequests")
    public ResponseEntity<List<AuthorizationRequest>> getAllAuthorizationRequests() {
        List<AuthorizationRequest> authorizationRequests = authorizationRequestRepository.findAll();
        return ResponseEntity.ok(authorizationRequests);
    }

    // Delete an authorization request by ID
    @DeleteMapping("/deleteAuthorizationRequestByID/{id}")
    public boolean deleteAuthorizationRequestByID(@PathVariable("id") int id) {
        return emailSenderService.deleteAuthorizationRequestByID(id);
    }

    @DeleteMapping("/deleteAllAuthorizationRequests")
    public ResponseEntity<?> deleteAllAuthorizationRequests() {
        emailSenderService.deleteAllAuthorizationRequests();
        return ResponseEntity.ok().body("{\"message\": \"All requests have been deleted successfully.\"}");
    }
    @DeleteMapping("/deleteMultipleAuthorizationRequests")
    public ResponseEntity<?> deleteMultipleAuthorizationRequests(@RequestBody List<Long> ids) {
        emailSenderService.deleteMultipleAuthorizationRequests(ids);
        return ResponseEntity.ok().body("{\"message\": \"Selected requests have been deleted successfully.\"}");
    }
    @GetMapping("/acceptedRequests")
    public List<Request> getAcceptedRequests() {
        return requestRepository.findByStatus("Accepted");
    }
    @GetMapping("/exportRequestsToExcel")
    public ResponseEntity<byte[]> exportRequestsToExcel() {
        try {
            List<Request> requests = requestRepository.findAll();

            ByteArrayOutputStream bos = new ByteArrayOutputStream();
            Workbook workbook = new XSSFWorkbook();
            Sheet sheet = workbook.createSheet("Requests");

            // Create header row
            Row headerRow = sheet.createRow(0);
            headerRow.createCell(0).setCellValue("T:");
            headerRow.createCell(1).setCellValue("Training");
            Row headerRow2 = sheet.createRow(1);
            headerRow2.createCell(0).setCellValue("0:");
            headerRow2.createCell(1).setCellValue("means \"day not worked\" ");
            Row headerRow3 = sheet.createRow(2);
            headerRow3.createCell(0).setCellValue("1:");
            headerRow3.createCell(1).setCellValue("means \"day  fully worked\"");
            Row headerRow4 = sheet.createRow(3);
            headerRow4.createCell(0).setCellValue("0.5:");
            headerRow4.createCell(1).setCellValue("means \"between 3 and 5 hours worked\"");
            Row headerRow5 = sheet.createRow(4);
            headerRow5.createCell(0).setCellValue("V:");
            headerRow5.createCell(1).setCellValue("Vacation");
            Row headerRow6 = sheet.createRow(5);
            headerRow6.createCell(0).setCellValue("PH:");
            headerRow6.createCell(1).setCellValue("Public holidays");
            Row headerRow7 = sheet.createRow(6);
            headerRow7.createCell(0).setCellValue("WE:");
            headerRow7.createCell(1).setCellValue("WeekEnd");
            Row headerRow8 = sheet.createRow(7);
            headerRow8.createCell(0).setCellValue("NI:");
            headerRow8.createCell(1).setCellValue("Not Invoiced");
            String[] months = {"January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"};

            Row headerMonthRow = sheet.createRow(8);
            headerMonthRow.createCell(1).setCellValue("Month");
            Row headerWeekRow = sheet.createRow(9);
            headerWeekRow.createCell(1).setCellValue("Week");
            Row headerDayRow = sheet.createRow(10);
            headerDayRow.createCell(1).setCellValue("Day");

            int monthCellIndex = 2; // Start from column 2 for months (column B in Excel)
            int weekCellIndex = 2;  // Start from column 2 for weeks (column B in Excel)
            int dayCellIndex = 2;   // Start from column 2 for days (column B in Excel)
            int weekCount = 0;

// Iterate through each month
            for (int monthIndex = 0; monthIndex < months.length; monthIndex++) {
                String month = months[monthIndex];
                int monthNum = monthIndex + 1;
                int daysInMonth = YearMonth.of(2024, monthNum).lengthOfMonth(); // Adjust year as needed

                // Create month header cell
                headerMonthRow.createCell(monthCellIndex).setCellValue(month);

                // Create weeks and days headers for each month
                int currentWeek = 1;

                for (int day = 1; day <= daysInMonth; day++) {
                    // Determine the week number for the current day
                    int weekNum = (day - 1) / 7 + 1;

                    // Check if a new week is starting
                    if (weekNum > weekCount) {
                        // Create a new week header cell
                        headerWeekRow.createCell(weekCellIndex).setCellValue("Week " + currentWeek);
                        weekCount = weekNum;
                        currentWeek++;
                    }

                    // Fill the day cell
                    Cell dayCell = headerDayRow.createCell(dayCellIndex);
                    dayCell.setCellValue(day);

                    // Move to the next day and week cell
                    dayCellIndex++;
                    weekCellIndex++;
                }

                // Move to the next month cell
                monthCellIndex += daysInMonth;
            }
            // Create cell style for green background
            CellStyle greenCellStyle = createCellStyle(workbook, IndexedColors.LIGHT_GREEN);
            CellStyle redCellStyle = createCellStyle(workbook, IndexedColors.RED);
            // Assuming you have a method to get all teams

            int rowIndex = 11; // Start writing data from the second row
            for (Team team : teamService.getAllTeamExcel()) {
                // Write team name
                Row teamRow = sheet.createRow(rowIndex++);
                teamRow.createCell(1).setCellValue(team.getName());

                // Write each employee's name under the team
                for (Employee employee : team.getEmployees()) {
                    Row employeeRow = sheet.createRow(rowIndex++);
                    employeeRow.createCell(0).setCellValue("RENAULT");
                    employeeRow.createCell(1).setCellValue(employee.getFirstname() + " " + employee.getLastname());

                    for (int monthIndex = 0; monthIndex < 12; monthIndex++) {
                        int daysInMonth = YearMonth.of(2024, monthIndex + 1).lengthOfMonth();

                        for (int day = 1; day <= daysInMonth; day++) {
                            Cell cell = employeeRow.createCell(2 + day - 1); // Column for each day
                            Date currentDate = new Date(2024 - 1900, monthIndex, day); // Adjust year as needed

                            boolean isOnLeave = isEmployeeOnLeave(employee, currentDate, requests);
                            if (isOnLeave) {
                                cell.setCellValue("0");
                                cell.setCellStyle(redCellStyle);
                            } else {
                                cell.setCellValue("1");
                                cell.setCellStyle(greenCellStyle);
                            }
                        }
                    }
                }
            }
           // Fill data
            int rowNum = 40;

            workbook.write(bos);
            workbook.close();

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"));
            headers.setContentDispositionFormData("attachment", "requests.xlsx");

            return new ResponseEntity<>(bos.toByteArray(), headers, HttpStatus.OK);
        } catch (IOException e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    private CellStyle createCellStyle(Workbook workbook, IndexedColors color) {
        CellStyle cellStyle = workbook.createCellStyle();
        cellStyle.setFillForegroundColor(color.getIndex());
        cellStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);
        return cellStyle;
    }

    private boolean isEmployeeOnLeave(Employee employee, Date date, List<Request> requests) {
        for (Request request : requests) {
            if (request.getEmployeeEmail().equals(employee.getEmail()) &&
                    !date.before(request.getStartDate()) &&
                    !date.after(request.getEndDate())) {
                return true;
            }
        }
        return false;
    }
    @GetMapping("/notifications")
    public ResponseEntity<List<Request>> getAllNotifications() {
        List<Request> notifications = emailSenderService.getAllNotifications(); // Utilisez votre service pour récupérer les notifications


        return ResponseEntity.ok(notifications);
    }




    //cal int




}