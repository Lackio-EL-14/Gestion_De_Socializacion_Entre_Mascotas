package com.dogchat.admin_service.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import jakarta.persistence.Id;
import jakarta.persistence.Column;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.JoinColumn;
import java.time.LocalDateTime;

@Entity
@Table(name = "REPORTE")
public class Reporte {

    @Id
    @Column(name = "id_reporte")
    private Integer idReporte;

    @ManyToOne
    @JoinColumn(name = "id_usuario_reportante")
    private Usuario usuarioReportante;

    @ManyToOne
    @JoinColumn(name = "id_usuario_reportado")
    private Usuario usuarioReportado;

    @Column(name = "motivo")
    private String motivo;

    @Column(name = "comentario")
    private String comentario;

    @Column(name = "estado")
    private String estado;

    @ManyToOne
    @JoinColumn(name = "id_admin_resolutor")
    private Usuario adminResolutor;

    @Column(name = "fecha_resolucion")
    private LocalDateTime fechaResolucion;


    public Integer getIdReporte() { return idReporte; }
    public void setIdReporte(Integer idReporte) { this.idReporte = idReporte; }

    public Usuario getUsuarioReportante() { return usuarioReportante; }
    public void setUsuarioReportante(Usuario usuarioReportante) { this.usuarioReportante = usuarioReportante; }

    public Usuario getUsuarioReportado() { return usuarioReportado; }
    public void setUsuarioReportado(Usuario usuarioReportado) { this.usuarioReportado = usuarioReportado; }

    public String getMotivo() { return motivo; }
    public void setMotivo(String motivo) { this.motivo = motivo; }

    public String getComentario() { return comentario; }
    public void setComentario(String comentario) { this.comentario = comentario; }

    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }

    public Usuario getAdminResolutor() { return adminResolutor; }
    public void setAdminResolutor(Usuario adminResolutor) { this.adminResolutor = adminResolutor; }

    public LocalDateTime getFechaResolucion() { return fechaResolucion; }
    public void setFechaResolucion(LocalDateTime fechaResolucion) { this.fechaResolucion = fechaResolucion; }
}
