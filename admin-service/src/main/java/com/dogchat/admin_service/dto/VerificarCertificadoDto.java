package com.dogchat.admin_service.dto;

public class VerificarCertificadoDto {
    private Integer idAdmin;
    private String decision;

    public Integer getIdAdmin() { return idAdmin; }
    public void setIdAdmin(Integer idAdmin) { this.idAdmin = idAdmin; }

    public String getDecision() { return decision; }
    public void setDecision(String decision) { this.decision = decision; }
}
