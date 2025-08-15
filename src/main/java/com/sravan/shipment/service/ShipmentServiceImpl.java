package com.sravan.shipment.service;

import com.sravan.shipment.authentication.exception.BusinessException;
import com.sravan.shipment.dto.ShipmentFilterRequest;
import com.sravan.shipment.dto.ShipmentRequest;
import com.sravan.shipment.dto.ShipmentResponse;
import com.sravan.shipment.entity.ShipmentEntity;
import com.sravan.shipment.entity.ShipmentType;
import com.sravan.shipment.repository.ShipmentRepository;
import com.sravan.shipment.specification.ShipmentSpecification;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ShipmentServiceImpl implements ShipmentService {

    private final ShipmentRepository shipmentRepository;

    @Override
    public ShipmentResponse addShipment(String userId, ShipmentRequest request) {
        ShipmentEntity shipment = ShipmentEntity.builder()
                .userId(userId)
                .shipmentTitle(request.getShipmentTitle())
                .shipmentDescription(request.getShipmentDescription())
                .shipmentType(request.getShipmentType())
                .isDelivered(request.getIsDelivered())
                .cost(request.getCost())
                .shipmentDate(request.getShipmentDate())
                .build();
        return convertToResponse(shipmentRepository.save(shipment));
    }

    @Override
    public ShipmentResponse updateShipment(String userId, long shipmentId, ShipmentRequest request) {
        ShipmentEntity shipment = shipmentRepository.findById(shipmentId)
                .orElseThrow(() -> new BusinessException("Shipment not found", HttpStatus.NOT_FOUND));

        if (!shipment.getUserId().equals(userId)) {
            throw new BusinessException("Unauthorized", HttpStatus.UNAUTHORIZED);
        }

        shipment.setShipmentTitle(request.getShipmentTitle());
        shipment.setShipmentDescription(request.getShipmentDescription());
        shipment.setShipmentType(request.getShipmentType());
        shipment.setDelivered(request.getIsDelivered());
        shipment.setCost(request.getCost());
        shipment.setShipmentDate(request.getShipmentDate());

        return convertToResponse(shipmentRepository.save(shipment));
    }

    @Override
    public ShipmentResponse getShipment(String userId, long shipmentId) {
        ShipmentEntity shipment = shipmentRepository.findById(shipmentId)
                .orElseThrow(() -> new BusinessException("Shipment not found", HttpStatus.NOT_FOUND));

        if (!shipment.getUserId().equals(userId)) {
            throw new BusinessException("Unauthorized", HttpStatus.UNAUTHORIZED);
        }
        return convertToResponse(shipment);
    }

//    @Override
//    public List<ShipmentResponse> getAllShipments(String userId) {
//        return shipmentRepository.findByUserId(userId)
//                .stream()
//                .map(this::convertToResponse)
//                .sorted(Comparator.comparing(ShipmentResponse::getShipmentDate).reversed())
//                .collect(Collectors.toList());
//    }
    @Override
    public Page<ShipmentResponse> getAllShipments(String userId, Pageable pageable) {
    return shipmentRepository.findByUserId(userId, pageable)
            .map(this::convertToResponse);
    }

    @Override
    public void deleteShipment(String userId, long shipmentId) {
        ShipmentEntity shipment = shipmentRepository.findById(shipmentId)
                .orElseThrow(() -> new BusinessException("Shipment not found", HttpStatus.NOT_FOUND));

        if (!shipment.getUserId().equals(userId)) {
            throw new BusinessException("Unauthorized", HttpStatus.UNAUTHORIZED);
        }
        shipmentRepository.delete(shipment);
    }

    private ShipmentResponse convertToResponse(ShipmentEntity shipment) {
        return ShipmentResponse.builder()
                .id(shipment.getId())
                .shipmentTitle(shipment.getShipmentTitle())
                .shipmentDescription(shipment.getShipmentDescription())
                .shipmentType(shipment.getShipmentType())
                .isDelivered(shipment.isDelivered())
                .cost(shipment.getCost())
                .shipmentDate(shipment.getShipmentDate())
                .build();
    }

//    @Override
//    public List<ShipmentResponse> filterShipments(String userId, ShipmentFilterRequest filterRequest) {
//        Specification<ShipmentEntity> spec = Specification.where(ShipmentSpecification.hasUserId(userId));
//
//        if (filterRequest.getShipmentType() != null) {
//            spec = spec.and(ShipmentSpecification.hasShipmentType(filterRequest.getShipmentType()));
//        }
//
//        if (filterRequest.getStartDate() != null) {
//            spec = spec.and(ShipmentSpecification.dateAfter(filterRequest.getStartDate()));
//        }
//
//        if (filterRequest.getEndDate() != null) {
//            spec = spec.and(ShipmentSpecification.dateBefore(filterRequest.getEndDate()));
//        }
//
//        if (filterRequest.getMinCost() != null) {
//            spec = spec.and(ShipmentSpecification.costGTE(filterRequest.getMinCost()));
//        }
//
//        if (filterRequest.getMaxCost() != null) {
//            spec = spec.and(ShipmentSpecification.costLTE(filterRequest.getMaxCost()));
//        }
//
//        if (filterRequest.getKeyword() != null && !filterRequest.getKeyword().isEmpty()) {
//            spec = spec.and(ShipmentSpecification.titleOrDescContains(filterRequest.getKeyword()));
//        }
//
//        return shipmentRepository.findAll(spec)
//                .stream()
//                .map(this::convertToResponse)
//                .collect(Collectors.toList());
//    }
    @Override
    public Page<ShipmentResponse> filterShipments(String userId, ShipmentFilterRequest filterRequest, Pageable pageable) {
        Specification<ShipmentEntity> spec = Specification.where(ShipmentSpecification.hasUserId(userId));

        if (filterRequest.getShipmentType() != null) {
            spec = spec.and(ShipmentSpecification.hasShipmentType(filterRequest.getShipmentType()));
        }
        if (filterRequest.getStartDate() != null) {
            spec = spec.and(ShipmentSpecification.dateAfter(filterRequest.getStartDate()));
        }
        if (filterRequest.getEndDate() != null) {
            spec = spec.and(ShipmentSpecification.dateBefore(filterRequest.getEndDate()));
        }
        if (filterRequest.getMinCost() != null) {
            spec = spec.and(ShipmentSpecification.costGTE(filterRequest.getMinCost()));
        }
        if (filterRequest.getMaxCost() != null) {
            spec = spec.and(ShipmentSpecification.costLTE(filterRequest.getMaxCost()));
        }
        if (filterRequest.getKeyword() != null && !filterRequest.getKeyword().isEmpty()) {
            spec = spec.and(ShipmentSpecification.titleOrDescContains(filterRequest.getKeyword()));
        }
        if (filterRequest.getIsDelivered() != null) {
            spec = spec.and(ShipmentSpecification.isDelivered(filterRequest.getIsDelivered()));
        }

        return shipmentRepository.findAll(spec, pageable)
                .map(this::convertToResponse);
    }
}
