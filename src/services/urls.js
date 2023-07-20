export const urlServices = {
  DEV: {
    Resourses:
      "http://ecc-dev.gbm.net:8000/sap/bc/srt/wsdl/flv_10002A111AD1/srvc_url/sap/bc/srt/rfc/sap/zmrs_mng_get_info/120/zmrs_mng_get_info/zmrs_mng_get_info?sap-client=120",
    HCGetInfoPosition:
      "http://ecc-dev.gbm.net:8000/sap/bc/srt/wsdl/flv_10002A111AD1/srvc_url/sap/bc/srt/rfc/sap/zhr_sd_positions_get_info/120/zhr_sd_positions_get_info/zhr_sd_positions_get_info?sap-client=120",
    Collaborators:
      "http://ecc-dev.gbm.net:8000/sap/bc/srt/wsdl/flv_10002A111AD1/srvc_url/sap/bc/srt/rfc/sap/zhr_sd_get_all_mang_employee/120/zhr_sd_get_all_mang_employee/zhr_sd_get_all_mang_employee?sap-client=120",
  },
  QA: {
    Resourses:
      "http://ecc-qa.gbm.net:8000/sap/bc/srt/wsdl/flv_10002A111AD1/bndg_url/sap/bc/srt/rfc/sap/zmrs_mng_get_info/260/zmrs_mng_get_info/zmrs_mng_get_info?sap-client=260",
    HCGetInfoPosition:
      "http://ecc-qa.gbm.net:8000/sap/bc/srt/wsdl/flv_10002A111AD1/srvc_url/sap/bc/srt/rfc/sap/zhr_sd_get_info_position/260/zhr_sd_get_info_position/zhr_sd_get_info_position?sap-client=260",
    Collaborators:
      "http://ecc-qa.gbm.net:8000/sap/bc/srt/wsdl/flv_10002A111AD1/srvc_url/sap/bc/srt/rfc/sap/zhr_sd_get_all_employee/260/zhr_sd_get_all_employee/zhr_sd_get_all_employee?sap-client=260",
    UpdateVacantPosition:
      "http://ecc-qa.gbm.net:8000/sap/bc/srt/wsdl/flv_10002A111AD1/srvc_url/sap/bc/srt/rfc/sap/zhr_sd_update_position/260/zhr_sd_update_position/zhr_sd_update_position?sap-client=260",
    UPDATE_EXTRAS_2005:
      "http://ecc-qa.gbm.net:8000/sap/bc/srt/wsdl/flv_10002A111AD1/bndg_url/sap/bc/srt/rfc/sap/zhr_ws_actualiza_inf2005/260/zhr_ws_actualiza_inf2005/zhr_ws_actualiza_inf2005?sap-client=260",
    Protected:
      "http://ecc-qa.gbm.net:8000/sap/bc/srt/wsdl/flv_10000S101AD1/bndg_url/sap/bc/srt/rfc/sap/zfirma_digital_detalle_usuario/260/zfirma_digital_detalle_usuario/zfirma_digital_detalle_usuario?sap-client=260",
    Salary:
      "http://ecc-qa.gbm.net:8000/sap/bc/srt/wsdl/flv_10002A111AD1/bndg_url/sap/bc/srt/rfc/sap/zhr_appr_salary/260/zhr_app_salary/zhr_app_salary?sap-client=260",
    OpportunityInformations:
      "http://crm-qa.gbm.net:8000/sap/bc/srt/wsdl/flv_10002A111AD1/bndg_url/sap/bc/srt/rfc/sap/zapi_opp_detail/460/zapi_opp_detail/zapi_opp_detail?sap-client=460",
    UpdateTargetLetter:
      "http://ecc-qa.gbm.net:8000/sap/bc/srt/wsdl/flv_10002A111AD1/bndg_url/sap/bc/srt/rfc/sap/zupdate_carta/260/zws_update_carta/update_carta?sap-client=260",
  },
  PRD: {
    Protected:
      "http://ecc-prod-app.gbm.net:8001/sap/bc/srt/wsdl/flv_10002A111AD1/bndg_url/sap/bc/srt/rfc/sap/zfirma_digital_detalle_usuario/300/zfirma_digital_detalle_usuario/zfirma_digital_detalle_usuario?sap-client=300",
    Ticket:
      "http://ecc-prod-app.gbm.net:8001/sap/bc/srt/wsdl/flv_10002A111AD1/bndg_url/sap/bc/srt/rfc/sap/zorden_digital_detalles3/300/zorden_digital_detalles3/zorden_digital_detalles3?sap-client=300",
    HCGetInfoPosition:
      "http://ecc-prod-app.gbm.net:8001/sap/bc/srt/wsdl/flv_10002A111AD1/bndg_url/sap/bc/srt/rfc/sap/zhr_sd_get_info_position/300/zhr_sd_get_info_position/zhr_sd_get_info_position?sap-client=300",
    Collaborators:
      "http://ecc-prod-app.gbm.net:8001/sap/bc/srt/wsdl/flv_10002A111AD1/bndg_url/sap/bc/srt/rfc/sap/zhr_sd_get_all_employee/300/zhr_sd_get_all_employee/zhr_sd_get_all_employee?sap-client=300",
    UpdateVacantPosition:
      "http://ecc-prod-app.gbm.net:8001/sap/bc/srt/wsdl/flv_10002A111AD1/bndg_url/sap/bc/srt/rfc/sap/zhr_sd_update_pos_vacante/300/zhr_sd_update_pos_vacante/zhr_sd_update_pos_vacante?sap-client=300",
    UPDATE_EXTRAS_2005:
      "http://ecc-prod-app.gbm.net:8001/sap/bc/srt/wsdl/flv_10002A111AD1/bndg_url/sap/bc/srt/rfc/sap/zhr_ws_actualiza_inf2005/300/zhr_ws_actualiza_inf2005/zhr_ws_actualiza_inf2005?sap-client=300",
    OpportunityInformations:
      "http://crm-prod-app.gbm.net:8001/sap/bc/srt/wsdl/flv_10002A111AD1/bndg_url/sap/bc/srt/rfc/sap/zapi_opp_detail/500/zapi_opp_detail/zapi_opp_detail?sap-client=500",
    Salary:
      "http://ecc-prod-app.gbm.net:8001/sap/bc/srt/wsdl/flv_10002A111AD1/bndg_url/sap/bc/srt/rfc/sap/zhr_web_salario2/300/zhr_web_salario2/zhr_web_salario2?sap-client=300",
    // "http://ecc-prod-app.gbm.net:8001/sap/bc/srt/wsdl/flv_10002A111AD1/bndg_url/sap/bc/srt/rfc/sap/zhr_appr_salary/300/zhr_appr_salary/zhr_appr_salary?sap-client=300",

    UpdateTargetLetter:
      "http://ecc-prod-app.gbm.net:8001/sap/bc/srt/wsdl/flv_10002A111AD1/srvc_url/sap/bc/srt/rfc/sap/zupdate_carta/300/zupdate_carta/zupdate_carta?sap-client=300",
  },
};
