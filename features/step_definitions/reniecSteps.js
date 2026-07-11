/**
 * La Step Definition que Cucumber interpreta. 
 * Mapea el comportamiento de las pruebas hacia el controlador 
 * usando Cucumber Expressions.
 */

const { Given, When, Then } = require('@cucumber/cucumber');
const assert = require('assert');

// Importamos los componentes de la arquitectura del Portal
const ReniecGateway = require('../../src/gateway/reniecGateway');
const ResearchController = require('../../src/controllers/researchController');

// Instanciamos el contexto de ejecución de la prueba aislada
const gateway = new ReniecGateway();
const controller = new ResearchController(gateway);
let targetDni = "";

Given('the professor is on the registration system', function () {
    // Inicialización del estado limpio del controlador antes del flujo
    targetDni = "";
    gateway.forceResponseStatus(200);
});

Given('they have entered the National ID {string} in the co-authors section', function (dni) {
    targetDni = dni;
});

Given('the RENIEC external service is currently down', function () {
    // Inyección del Mock: Forzamos el fallo técnico controlado para mitigar la incertidumbre
    gateway.forceResponseStatus(500);
});

When('the system requests validation from the RENIEC external API', async function () {
    await controller.registerCoauthor(targetDni);
});

Then('the portal must display the error message {string}', function (expectedMessage) {
    assert.strictEqual(controller.systemMessage, expectedMessage);
});

Then('the {string} button must remain disabled', function (buttonName) {
    assert.strictEqual(controller.isSaveButtonEnabled, false);
});

Then('the portal must display the warning message {string}', function (expectedWarning) {
    assert.strictEqual(controller.systemMessage, expectedWarning);
});

Then('the article status must be updated to {string}', function (expectedStatus) {
    assert.strictEqual(controller.articleStatus, expectedStatus);
});
