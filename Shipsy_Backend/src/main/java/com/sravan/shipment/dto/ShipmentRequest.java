package com.sravan.shipment.dto;

<<<<<<< HEAD
import com.sravan.shipment.entity.ShipmentType;
=======
>>>>>>> 9ea815c (Final Push)
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ShipmentRequest {

    @NotBlank(message = "Shipment title cannot be empty")
    private String shipmentTitle;

    private String shipmentDescription;

    @NotNull(message = "Shipment type cannot be empty")
<<<<<<< HEAD
    private ShipmentType shipmentType;

    @NotNull(message = "Delivery status cannot be empty")
    private Boolean isDelivered;
=======
    private String shipmentType;

    @NotNull(message = "Delivery status cannot be empty")
    private Boolean delivered;
>>>>>>> 9ea815c (Final Push)

    @Positive(message = "Cost must be positive")
    private double cost;

    @NotNull(message = "Shipment date cannot be empty")
    private LocalDate shipmentDate;
}
