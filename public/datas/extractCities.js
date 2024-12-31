const fs = require('fs');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const countryId = 1; // ID de la Belgique dans la table Country

async function insertCities() {
    try {
        console.log('Loading JSON data...');
        const data = fs.readFileSync('public/datas/georef-belgium-postal-codes.json', 'utf-8');
        const json = JSON.parse(data);

        // Filtrer les villes et éliminer les doublons
        const cities = Array.from(
            new Map(
                json
                    .filter((item) => item.smun_name_fr && item.postcode) // Assurez-vous d'avoir un nom et un code postal
                    .map((item) => [item.postcode, { cityCode: item.postcode, name: item.smun_name_fr, countryId }])
            ).values()
        );

        console.log(`Inserting ${cities.length} unique cities into the database...`);

        for (const city of cities) {
            await prisma.city.create({
                data: city,
            });
        }

        console.log('All cities have been inserted successfully.');
    } catch (error) {
        console.error('Error while inserting cities:', error);
    } finally {
        await prisma.$disconnect();
    }
}

insertCities();
