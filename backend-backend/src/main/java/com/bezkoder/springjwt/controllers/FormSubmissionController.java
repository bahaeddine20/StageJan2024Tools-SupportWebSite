package com.bezkoder.springjwt.controllers;

import antlr.ASTNULLType;

import com.bezkoder.springjwt.models.AuthorizationRequest;
import com.bezkoder.springjwt.models.FormSubmissionDTO;
import com.bezkoder.springjwt.models.Request;
import com.bezkoder.springjwt.repository.AuthorizationRequestRepository;
import com.bezkoder.springjwt.repository.RequestRepository;
import com.bezkoder.springjwt.security.services.EmailService;

import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.data.domain.Pageable;

import javax.validation.Valid;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@CrossOrigin(origins = "*") // Allow requests from Angular frontend
@RestController
public class FormSubmissionController {

    @Autowired
    private EmailService emailSenderService;

    @Autowired
    private RequestRepository requestRepository;

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

            emailSenderService.sendAuthorizationRequestEmail(authorizationRequest.getAdminEmail(), emailMessage);

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
            headerRow.createCell(0).setCellValue("ID");
            headerRow.createCell(1).setCellValue("Name");
            headerRow.createCell(2).setCellValue("Employee Email");
            headerRow.createCell(3).setCellValue("Start Date");
            headerRow.createCell(4).setCellValue("End Date");
            headerRow.createCell(5).setCellValue("Reason");
            headerRow.createCell(6).setCellValue("Status");

            // Fill data
            int rowNum = 1;
            for (Request request : requests) {
                Row row = sheet.createRow(rowNum++);
                row.createCell(0).setCellValue(request.getId());
                row.createCell(1).setCellValue(request.getName());
                row.createCell(2).setCellValue(request.getEmployeeEmail());
                row.createCell(3).setCellValue(request.getStartDate().toString());
                row.createCell(4).setCellValue(request.getEndDate().toString());
                row.createCell(5).setCellValue(request.getReason());
                row.createCell(6).setCellValue(request.getStatus());
            }

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
    @GetMapping("/notifications")
    public ResponseEntity<List<Request>> getAllNotifications() {
        List<Request> notifications = emailSenderService.getAllNotifications(); // Utilisez votre service pour récupérer les notifications
        return ResponseEntity.ok(notifications);
    }

}