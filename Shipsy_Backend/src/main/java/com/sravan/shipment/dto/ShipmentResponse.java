package com.sravan.shipment.dto;

<<<<<<< HEAD
import com.sravan.shipment.entity.ShipmentType;
=======
>>>>>>> 9ea815c (Final Push)
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
<<<<<<< HEAD
    private ShipmentType shipmentType;
    private boolean isDelivered;
=======
    private String shipmentType;
    private boolean delivered;
>>>>>>> 9ea815c (Final Push)
    private double cost;
    private LocalDate shipmentDate;
}
