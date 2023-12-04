// Archivo: index.js
const axios = require('axios'); // Importa la biblioteca axios para realizar solicitudes HTTP.
const cheerio = require('cheerio'); // Importa cheerio para analizar y manipular el HTML.

/**
 * Función principal que inicia el programa y muestra un menú de opciones.
 */
async function main() {
    while (true) {
        console.log("Selecciona una opción:");
        console.log("1. Buscar y traer información de Wikipedia");
        console.log("2. Traer el último encabezado de noticias de TELEVISA");
        console.log("3. Traer el precio de algún producto de NIKE");
        console.log("4. Salir");

        const opcion = parseInt(await prompt("Opción: "));
        switch (opcion) {
            case 1:
                await buscarEnWikipedia();
                break;

            case 2:
                await traerUltimoEncabezadoTelevisa();
                break;

            case 3:
                await traerPrecioPaginaCompras();
                break;

            case 4:
                process.exit();
                break;

            default:
                console.log("Opción no válida. Inténtalo de nuevo.");
                break;
        }
    }
}

/**
 * Función que realiza una búsqueda en Wikipedia y muestra información relevante.
 */
async function buscarEnWikipedia() {
    const busqueda = await prompt("Ingresa el término de búsqueda en Wikipedia: ");
    const url = `https://es.wikipedia.org/w/api.php?action=query&format=json&list=search&srsearch=${busqueda}`;

    try {
        const response = await axios.get(url);
        const data = response.data;

        // Procesa la información según tus necesidades
        const resultados = data.query.search;

        if (resultados.length === 0) {
            console.log("No se encontraron resultados.");
        } else {
            console.log("Resultados de la búsqueda en Wikipedia:");
            resultados.forEach((result, index) => {
                console.log(`[${index + 1}] Título: ${result.title}`);
                console.log(`    Descripción: ${result.snippet}`);
                console.log(`    URL: https://es.wikipedia.org/wiki/${result.title.replace(/\s+/g, '_')}`);
                console.log("\n");
            });
        }
    } catch (error) {
        console.error("Error al realizar la búsqueda en Wikipedia:", error.message);
    }
}

/**
 * Función que obtiene el último encabezado de noticias de www.televisa.com.
 */
async function traerUltimoEncabezadoTelevisa() {
    const url = 'https://www.televisa.com/';

    try {
        const response = await axios.get(url);
        const html = response.data;

        const $ = cheerio.load(html);

        // Encuentra el elemento que contiene el último encabezado de noticias
        // Esto puede variar según la estructura del HTML de la página de Televisa
        const ultimoEncabezado = $('h3').first().text().trim();

        console.log(`Último encabezado de noticias de www.televisa.com: ${ultimoEncabezado}`);
    } catch (error) {
        console.error("Error al obtener el último encabezado de noticias de www.televisa.com:", error.message);
    }
}

/**
 * Función que obtiene el precio de una página de compras.
 */
async function traerPrecioPaginaCompras() {
    const url = await prompt("Ingresa la URL de algún producto para saber su precio: ");

    try {
        const response = await axios.get(url);
        const $ = cheerio.load(response.data);
        const precio = $('.product-price').text()
        console.log(`Precio de la página de compras: $${precio}`);
    } catch (error) {
        console.error("Error al obtener el precio de la página de compras:", error.message);
    }
}

/**
 * Función que realiza una pregunta al usuario y devuelve la respuesta.
 * @param {string} question - La pregunta que se muestra al usuario.
 * @returns {Promise<string>} - La respuesta del usuario.
 */
function prompt(question) {
    return new Promise(resolve => {
        const readline = require('readline').createInterface({
            input: process.stdin,
            output: process.stdout
        });

        readline.question(question, answer => {
            readline.close();
            resolve(answer);
        });
    });
}

// Inicia el programa llamando a la función principal.
main();
