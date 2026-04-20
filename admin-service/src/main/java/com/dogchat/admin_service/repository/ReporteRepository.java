package com.dogchat.admin_service.repository;

import com.dogchat.admin_service.entity.Reporte;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ReporteRepository extends JpaRepository<Reporte, Integer> {
    List<Reporte> findByEstado(String estado);
}
