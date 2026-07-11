/**
 * Componente de la capa de negocio que procesa las reglas 
 * planteadas en el laboratorio. 
 * Gestiona las excepciones del validador de identidad.
 * 
 */

class ResearchController {
    constructor(reniecGateway) {
        this.reniecGateway = reniecGateway;
        this.isSaveButtonEnabled = true;
        this.systemMessage = "";
        this.articleStatus = "Nuevo";
    }

    async registerCoauthor(dni) {
        try {
            const result = await this.reniecGateway.validateDni(dni);

            if (!result.found) {
                this.isSaveButtonEnabled = false;
                this.systemMessage = "The entered ID does not exist in the national registry";
                this.articleStatus = "Rejected";
                return;
            }

            this.isSaveButtonEnabled = true;
            this.systemMessage = "Coauthor successfully validated";
            this.articleStatus = "Validated";

        } catch (error) {
            if (error.message === "RENIEC_SERVICE_DOWN") {
                // Regla de mitigación del riesgo: El sistema degrada la funcionalidad de forma segura
                this.isSaveButtonEnabled = true;
                this.systemMessage = "Validation service temporarily unavailable";
                this.articleStatus = "Draft Pending Validation";
            }
        }
    }
}

module.exports = ResearchController;
