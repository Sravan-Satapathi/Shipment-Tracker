package com.sravan.shipment.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "shipments")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ShipmentEntity {

    @Column(nullable = false)
    private String userId;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Text field
    @Column(nullable = false)
    private String shipmentTitle;

    // Text field (detailed description)
    @Column(nullable = false, columnDefinition = "TEXT")
    private String shipmentDescription;

    //Category
    @Column(nullable = false)
    private String shipmentType;

    // Boolean field
    @Column(nullable = false)
    private boolean delivered;

    // Cost field
    @Column(nullable = false)
    private double cost;

    // Date of shipment
    @Column(nullable = false)
    private LocalDate shipmentDate;

    public boolean getDelivered(){
        return delivered;
    }
}
