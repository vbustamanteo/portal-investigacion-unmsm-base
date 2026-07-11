/**
 Clase encargada de la comunicación
 externa. En un entorno real consumiría la API de RENIEC;
 para el entorno de pruebas, implementa un mecanismo 
 de configuración para inyectar estados y simular caídas de red.
**/

class ReniecGateway {
    constructor() {
        this.forcedStatus = 200; // Por defecto responde exitoso
    }

    // Permite al Mock del test inyectar un estado de fallo (ej. 500 o 404)
    forceResponseStatus(status) {
        this.forcedStatus = status;
    }

    async validateDni(dni) {
        // Simulación de comportamiento de la API externa de RENIEC
        if (this.forcedStatus === 500) {
            throw new Error("RENIEC_SERVICE_DOWN");
        }

        if (this.forcedStatus === 404 || dni === "00000000") {
            return { found: false, name: null };
        }

        return { found: true, name: "Investigador Verificado UNMSM" };
    }
}

module.exports = ReniecGateway;
