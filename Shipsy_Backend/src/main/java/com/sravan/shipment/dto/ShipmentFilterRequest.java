package com.sravan.shipment.dto;

import lombok.Data;

import com.sravan.shipment.entity.ShipmentType;
import lombok.Data;
import java.time.LocalDate;

@Data
public class ShipmentFilterRequest {
    private ShipmentType shipmentType;
    private LocalDate startDate;
    private LocalDate endDate;
    private Double minCost;
    private Double maxCost;
    private String keyword;
    private Boolean isDelivered;
}

