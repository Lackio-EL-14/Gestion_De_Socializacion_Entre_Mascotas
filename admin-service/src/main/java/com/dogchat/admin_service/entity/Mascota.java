package com.dogchat.admin_service.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import jakarta.persistence.Id;
import jakarta.persistence.Column;

@Entity
@Table(name = "MASCOTA")
public class Mascota {

    @Id
    @Column(name = "id_mascota")
    private Integer idMascota;

    @Column(name = "nombre")
    private String nombre;

    @Column(name = "raza")
    private String raza;

    @Column(name = "estado_salud")
    private String estadoSalud;

    @Column(name = "vacuna_imagen_url")
    private String vacunaImagenUrl;

    @Column(name = "id_usuario")
    private Integer idUsuario;


    public Integer getIdMascota() { return idMascota; }
    public void setIdMascota(Integer idMascota) { this.idMascota = idMascota; }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public String getRaza() { return raza; }
    public void setRaza(String raza) { this.raza = raza; }

    public String getEstadoSalud() { return estadoSalud; }
    public void setEstadoSalud(String estadoSalud) { this.estadoSalud = estadoSalud; }

    public String getVacunaImagenUrl() { return vacunaImagenUrl; }
    public void setVacunaImagenUrl(String vacunaImagenUrl) { this.vacunaImagenUrl = vacunaImagenUrl; }

    public Integer getIdUsuario() { return idUsuario; }
    public void setIdUsuario(Integer idUsuario) { this.idUsuario = idUsuario; }
}
