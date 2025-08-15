package com.sravan.shipment.controller;

import com.sravan.shipment.authentication.exception.BusinessException;
import com.sravan.shipment.dto.ShipmentFilterRequest;
import com.sravan.shipment.dto.ShipmentRequest;
import com.sravan.shipment.dto.ShipmentResponse;
import com.sravan.shipment.service.ShipmentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.CurrentSecurityContext;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/shipments")
@RequiredArgsConstructor
public class ShipmentController {

    private final ShipmentService shipmentService;

    @PostMapping
    public ShipmentResponse addShipment(@Valid @RequestBody ShipmentRequest request,
                                        @CurrentSecurityContext(expression = "authentication?.name") String email) {
        try {
            return shipmentService.addShipment(email, request);
        } catch (Exception e) {
            throw new BusinessException("Shipment could not be created. Try later", HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/{id}")
    public ShipmentResponse getShipmentById(@PathVariable long id,
                                            @CurrentSecurityContext(expression = "authentication?.name") String email) {
        return shipmentService.getShipment(email, id);
    }

//    @GetMapping
//    public List<ShipmentResponse> getAllShipments(
//            @CurrentSecurityContext(expression = "authentication?.name") String email) {
//        return shipmentService.getAllShipments(email);
//    }
    @GetMapping
    public Page<ShipmentResponse> getAllShipments(
            @CurrentSecurityContext(expression = "authentication?.name") String email,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size,
            @RequestParam(defaultValue = "shipmentDate") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {

        Sort sort = sortDir.equalsIgnoreCase("asc") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);
        return shipmentService.getAllShipments(email, pageable);
    }

    @PutMapping("/{id}")
    public ShipmentResponse updateShipment(@PathVariable long id,
                                           @Valid @RequestBody ShipmentRequest request,
                                           @CurrentSecurityContext(expression = "authentication?.name") String email) {
        return shipmentService.updateShipment(email, id, request);
    }

    @DeleteMapping("/{id}")
    public void deleteShipment(@PathVariable long id,
                               @CurrentSecurityContext(expression = "authentication?.name") String email) {
        shipmentService.deleteShipment(email, id);
    }

//    @PostMapping("/filter")
//    public List<ShipmentResponse> filterShipments(@RequestBody ShipmentFilterRequest request,
//                                                  @CurrentSecurityContext(expression = "authentication?.name") String email) {
//        try {
//            return shipmentService.filterShipments(email, request);
//        } catch (Exception e) {
//            throw new BusinessException("Something went wrong while filtering shipments. Try later", HttpStatus.BAD_REQUEST);
//        }
//    }
    @PostMapping("/filter")
    public Page<ShipmentResponse> filterShipments(
            @RequestBody ShipmentFilterRequest request,
            @CurrentSecurityContext(expression = "authentication?.name") String email,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size,
            @RequestParam(defaultValue = "shipmentDate") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {

        Sort sort = sortDir.equalsIgnoreCase("asc") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);
        return shipmentService.filterShipments(email, request, pageable);
    }
}
