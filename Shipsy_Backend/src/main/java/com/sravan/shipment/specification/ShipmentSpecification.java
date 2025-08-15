package com.sravan.shipment.specification;

import com.sravan.shipment.entity.ShipmentEntity;
import com.sravan.shipment.entity.ShipmentType;
import org.springframework.data.jpa.domain.Specification;

import java.time.LocalDate;

public class ShipmentSpecification {

    public static Specification<ShipmentEntity> hasUserId(String userId) {
        return (root, query, cb) -> cb.equal(root.get("userId"), userId);
    }

    public static Specification<ShipmentEntity> hasShipmentType(ShipmentType shipmentType) {
        return (root, query, cb) -> cb.equal(root.get("shipmentType"), shipmentType);
    }

    public static Specification<ShipmentEntity> titleOrDescContains(String keyword) {
        return (root, query, cb) ->
                cb.or(
                        cb.like(cb.lower(root.get("shipmentTitle")), "%" + keyword.toLowerCase() + "%"),
                        cb.like(cb.lower(root.get("shipmentDescription")), "%" + keyword.toLowerCase() + "%")
                );
    }

    public static Specification<ShipmentEntity> dateAfter(LocalDate start) {
        return (root, query, cb) -> cb.greaterThanOrEqualTo(root.get("shipmentDate"), start);
    }

    public static Specification<ShipmentEntity> dateBefore(LocalDate end) {
        return (root, query, cb) -> cb.lessThanOrEqualTo(root.get("shipmentDate"), end);
    }

    public static Specification<ShipmentEntity> costGTE(Double minCost) {
        return (root, query, cb) -> cb.greaterThanOrEqualTo(root.get("cost"), minCost);
    }

    public static Specification<ShipmentEntity> costLTE(Double maxCost) {
        return (root, query, cb) -> cb.lessThanOrEqualTo(root.get("cost"), maxCost);
    }

    public static Specification<ShipmentEntity> isDelivered(Boolean delivered) {
        return (root, query, cb) -> cb.equal(root.get("isDelivered"), delivered);
    }
}
