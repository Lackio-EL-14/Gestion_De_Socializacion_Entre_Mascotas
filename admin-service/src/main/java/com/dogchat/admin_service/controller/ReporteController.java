package com.dogchat.admin_service.controller;

import com.dogchat.admin_service.entity.Reporte;
import com.dogchat.admin_service.service.ReporteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin(origins = "http://localhost:4200")
@RequestMapping("/api/admin/reportes") 
public class ReporteController {

    @Autowired
    private ReporteService reporteService;

    @GetMapping("/pendientes")
    public ResponseEntity<List<Reporte>> listarPendientes() {
        return ResponseEntity.ok(reporteService.obtenerPendientes());
    }

    @PostMapping("/{id}/procesar")
    public ResponseEntity<Reporte> procesarReporte(
            @PathVariable("id") Integer idReporte,
            @RequestBody Map<String, Object> payload) {

        Integer idAdmin = (Integer) payload.get("idAdmin");
        String accion = (String) payload.get("accion");

        Reporte reporteActualizado = reporteService.procesarReporte(idReporte, idAdmin, accion);
        
        return ResponseEntity.ok(reporteActualizado);
    }
}
