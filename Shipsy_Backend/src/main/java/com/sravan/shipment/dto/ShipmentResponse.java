package com.sravan.shipment.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ShipmentResponse {

    private long id;
    private String shipmentTitle;
    private String shipmentDescription;
    private String shipmentType;
    private boolean delivered;
    private double cost;
    private LocalDate shipmentDate;
}
