package com.clinic.demo.controller;

import com.clinic.demo.DTO.TreatmentFilterDTO;
import com.clinic.demo.DTO.TreatmentResponseDTO;
import com.clinic.demo.DTO.TreatmentUpdateDTO;
import com.clinic.demo.models.entity.TreatmentEntity;
import com.clinic.demo.service.TreatmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/treatments")
public class TreatmentController {

    private final TreatmentService treatmentService;

    @PostMapping("/filter")
    public ResponseEntity<List<TreatmentResponseDTO>> filterTreatmentsWithBody(
            @RequestBody TreatmentFilterDTO filterDTO) {

        List<TreatmentResponseDTO> treatments = treatmentService.filterTreatments(filterDTO);
        return ResponseEntity.ok(treatments);
    }

    @GetMapping("/{treatmentId}")
    public ResponseEntity<TreatmentResponseDTO> getTreatment(@PathVariable UUID treatmentId) {
        TreatmentEntity treatment = treatmentService.getTreatmentById(treatmentId);
        TreatmentResponseDTO responseDTO = TreatmentResponseDTO.fromEntity(treatment);
        return ResponseEntity.ok(responseDTO);
    }

    @GetMapping("/patient/{email}")
    public ResponseEntity<List<TreatmentResponseDTO>> getPatientTreatments(@PathVariable String email) {
        List<TreatmentResponseDTO> treatments = treatmentService.getTreatmentsByPatient(email);
        return ResponseEntity.ok(treatments);
    }

    @GetMapping("/doctor/{email}")
    public ResponseEntity<List<TreatmentResponseDTO>> getDoctorTreatments(@PathVariable String email) {
        List<TreatmentResponseDTO> treatments = treatmentService.getTreatmentsByDoctor(email);
        return ResponseEntity.ok(treatments);
    }

    @PatchMapping("/{treatmentId}")
    public ResponseEntity<String> updateTreatment(
            @PathVariable UUID treatmentId,
            @RequestBody TreatmentUpdateDTO updateDTO) {
        treatmentService.updateTreatment(treatmentId, updateDTO);
        return ResponseEntity.ok("Treatment updated successfully");
    }
}