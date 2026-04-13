package com.dogchat.admin_service.service;

import com.dogchat.admin_service.entity.Mascota;
import com.dogchat.admin_service.repository.MascotaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class MascotaAdminService {

    @Autowired
    private MascotaRepository mascotaRepository;

    public List<Mascota> obtenerCertificadosPendientes() {
        return mascotaRepository.findByEstadoVerificacionMedica("PENDIENTE");
    }

    public List<Mascota> obtenerCertificadosVerificados() {
        return mascotaRepository.findByEstadoVerificacionMedica("VERIFICADO");
    }

    public List<Mascota> obtenerCertificadosRechazados() {
        return mascotaRepository.findByEstadoVerificacionMedica("RECHAZADO");
    }

    public Mascota evaluarCertificado(Integer idMascota, Integer idAdmin, String decision) {
        Mascota mascota = mascotaRepository.findById(idMascota)
            .orElseThrow(() -> new RuntimeException("Mascota no encontrada"));

        if (!decision.equals("VERIFICADO") && !decision.equals("RECHAZADO")) {
            throw new IllegalArgumentException("Decision invalida");
        }

        mascota.setEstadoVerificacionMedica(decision);
        return mascotaRepository.save(mascota);
    }
}
