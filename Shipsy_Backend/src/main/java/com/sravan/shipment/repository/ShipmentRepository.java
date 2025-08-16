package com.sravan.shipment.repository;

import com.sravan.shipment.entity.ShipmentEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.List;

public interface ShipmentRepository extends JpaRepository<ShipmentEntity, Long>,
        JpaSpecificationExecutor<ShipmentEntity> {

<<<<<<< HEAD
//    List<ShipmentEntity> findByUserId(String userId);
    Page<ShipmentEntity> findByUserId(String userId, Pageable pageable);
=======
    List<ShipmentEntity> findByUserId(String userId);
//    Page<ShipmentEntity> findByUserId(String userId, Pageable pageable);
>>>>>>> 9ea815c (Final Push)
}
