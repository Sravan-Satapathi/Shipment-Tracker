package com.sravan.shipment.dto;

import lombok.Data;

<<<<<<< HEAD
import com.sravan.shipment.entity.ShipmentType;
=======
>>>>>>> 9ea815c (Final Push)
import lombok.Data;
import java.time.LocalDate;

@Data
public class ShipmentFilterRequest {
<<<<<<< HEAD
    private ShipmentType shipmentType;
=======
    private String shipmentType;
>>>>>>> 9ea815c (Final Push)
    private LocalDate startDate;
    private LocalDate endDate;
    private Double minCost;
    private Double maxCost;
    private String keyword;
    private Boolean isDelivered;
}

