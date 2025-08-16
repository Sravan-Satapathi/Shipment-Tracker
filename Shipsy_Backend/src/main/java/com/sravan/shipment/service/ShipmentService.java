package com.sravan.shipment.service;

import com.sravan.shipment.dto.ShipmentFilterRequest;
import com.sravan.shipment.dto.ShipmentRequest;
import com.sravan.shipment.dto.ShipmentResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface ShipmentService {
    ShipmentResponse addShipment(String userId, ShipmentRequest request);
    ShipmentResponse updateShipment(String userId, long shipmentId, ShipmentRequest request);
    ShipmentResponse getShipment(String userId, long shipmentId);
//    Page<ShipmentResponse> getAllShipments(String userId, Pageable pageable);
    List<ShipmentResponse> getAllShipments(String userId);
    void deleteShipment(String userId, long shipmentId);
//    Page<ShipmentResponse> filterShipments(String userId, ShipmentFilterRequest filterRequest, Pageable pageable);
    List<ShipmentResponse> filterShipments(String userId, ShipmentFilterRequest filterRequest);
}
