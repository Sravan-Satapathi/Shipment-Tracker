package com.sravan.shipment.dto;

import lombok.Data;

import lombok.Data;
import java.time.LocalDate;

@Data
public class ShipmentFilterRequest {
    private String shipmentType;
    private LocalDate startDate;
    private LocalDate endDate;
    private Double minCost;
    private Double maxCost;
    private String keyword;
    private Boolean isDelivered;
}

