package com.dogchat.admin_service.controller;

import com.dogchat.admin_service.dto.VerificarCertificadoDto;
import com.dogchat.admin_service.entity.Mascota;
import com.dogchat.admin_service.service.MascotaAdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:4200")
@RequestMapping("/api/admin/certificados")
public class MascotaAdminController {

    @Autowired
    private MascotaAdminService mascotaAdminService;

    @GetMapping("/pendientes")
    public List<Mascota> getPendientes() {
        return mascotaAdminService.obtenerCertificadosPendientes();
    }

    @PostMapping("/{id}/evaluar")
    public Mascota evaluar(@PathVariable Integer id, @RequestBody VerificarCertificadoDto dto) {
        return mascotaAdminService.evaluarCertificado(id, dto.getIdAdmin(), dto.getDecision());
    }

    @GetMapping("/verificadas")
    public List<Mascota> getVerificadas() {
        return mascotaAdminService.obtenerCertificadosVerificados();
    }

    @GetMapping("/rechazadas")
    public List<Mascota> getRechazadas() {
        return mascotaAdminService.obtenerCertificadosRechazados();
    }
}
