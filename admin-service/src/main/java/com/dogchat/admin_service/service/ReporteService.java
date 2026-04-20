package com.dogchat.admin_service.service;

import com.dogchat.admin_service.entity.Reporte;
import com.dogchat.admin_service.entity.Usuario;
import com.dogchat.admin_service.repository.ReporteRepository;
import com.dogchat.admin_service.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ReporteService {

    @Autowired
    private ReporteRepository reporteRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    public List<Reporte> obtenerPendientes() {
        return reporteRepository.findByEstado("pendiente");
    }
    
    @Transactional
    public Reporte procesarReporte(Integer idReporte, Integer idAdmin, String accion) {
        Reporte reporte = reporteRepository.findById(idReporte)
            .orElseThrow(() -> new RuntimeException("Reporte no encontrado"));

        Usuario admin = usuarioRepository.findById(idAdmin)
            .orElseThrow(() -> new RuntimeException("Admin no encontrado"));

        Usuario infractor = reporte.getUsuarioReportado();

        switch (accion) {
          case "PENALIZAR":
            int nuevosStrikes = infractor.getCantidadStrikes() + 1;
            infractor.setCantidadStrikes(nuevosStrikes);
            if (nuevosStrikes >= 3) {
                infractor.setEstaActivo(false);
            }
            reporte.setEstado("resuelto");
            break;

          case "BANEO_DIRECTO":
            infractor.setEstaActivo(false);
            reporte.setEstado("resuelto");
            break;

          case "IGNORAR":
            reporte.setEstado("ignorado");
            break;

        default:
            throw new RuntimeException("Acción de moderación no válida");
    }

    usuarioRepository.save(infractor);
    reporte.setAdminResolutor(admin);
    reporte.setFechaResolucion(LocalDateTime.now());

    return reporteRepository.save(reporte);
} 
}
