package com.dogchat.admin_service.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import jakarta.persistence.Id;
import jakarta.persistence.Column;

@Entity
@Table(name = "ROL") 
public class Rol {

    @Id
    @Column(name = "id_rol")
    private Integer idRol;

    @Column(name = "nombre_rol") 
    private String nombre;

    @Column(name = "descripcion")
    private String descripcion;

    public Integer getIdRol() {
        return idRol;
    }
    public void setIdRol(Integer idRol) {
        this.idRol = idRol;
    }

    public String getNombre() {
        return nombre;
    }
    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getDescripcion() {
        return descripcion;
    }
    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }
}
