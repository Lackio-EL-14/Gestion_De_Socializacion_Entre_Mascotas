package com.dogchat.admin_service.repository;

import com.dogchat.admin_service.entity.Mascota;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface MascotaRepository extends JpaRepository<Mascota, Integer> {
    List<Mascota> findByEstadoVerificacionMedica(String estadoVerificacionMedica);
}
