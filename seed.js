const fs = require('fs');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function seedDatabase() {
    try {
        console.log('Seeding the database...');

        // 1. Ajouter ou vérifier le pays "Belgium"
        let belgium = await prisma.country.findUnique({
            where: { countryCode: 'BE' },
        });

        if (!belgium) {
            belgium = await prisma.country.create({
                data: {
                    name: 'Belgium',
                    countryCode: 'BE',
                },
            });
            console.log('Country "Belgium" added.');
        } else {
            console.log('Country "Belgium" already exists.');
        }

        // 2. Ajouter ou vérifier le pays "France"
        let france = await prisma.country.findUnique({
            where: { countryCode: 'FR' },
        });

        if (!france) {
            france = await prisma.country.create({
                data: {
                    name: 'France',
                    countryCode: 'FR',
                },
            });
            console.log('Country "France" added.');
        } else {
            console.log('Country "France" already exists.');
        }

        // 3. Ajouter ou vérifier les types de TVA
        const vatTypes = [
            { label: 'Reduced VAT' },
            { label: 'Standard VAT' },
        ];

        for (const vatType of vatTypes) {
            const existingVatType = await prisma.vatType.findFirst({
                where: { label: vatType.label },
            });

            if (!existingVatType) {
                await prisma.vatType.create({ data: vatType });
                console.log(`VatType "${vatType.label}" added.`);
            } else {
                console.log(`VatType "${vatType.label}" already exists.`);
            }
        }

        // 4. Ajouter ou vérifier les taux de TVA
        const vatRates = [
            // Belgium VAT
            { vatTypeLabel: 'Reduced VAT', vatPercent: 6, countryId: belgium.id },
            { vatTypeLabel: 'Standard VAT', vatPercent: 21, countryId: belgium.id },
            // France VAT
            { vatTypeLabel: 'Reduced VAT', vatPercent: 5.5, countryId: france.id },
            { vatTypeLabel: 'Standard VAT', vatPercent: 20, countryId: france.id },
        ];

        for (const vatRate of vatRates) {
            const vatType = await prisma.vatType.findFirst({
                where: { label: vatRate.vatTypeLabel },
            });

            if (!vatType) {
                console.error(`VatType "${vatRate.vatTypeLabel}" not found.`);
                continue;
            }

            const existingVat = await prisma.vat.findFirst({
                where: {
                    vatTypeId: vatType.id,
                    countryId: vatRate.countryId,
                    vatPercent: vatRate.vatPercent,
                },
            });

            if (!existingVat) {
                await prisma.vat.create({
                    data: {
                        vatTypeId: vatType.id,
                        countryId: vatRate.countryId,
                        vatPercent: vatRate.vatPercent,
                    },
                });
                console.log(
                    `VAT ${vatRate.vatPercent}% (${vatRate.vatTypeLabel}) added for ${
                        vatRate.countryId === belgium.id ? 'Belgium' : 'France'
                    }.`
                );
            } else {
                console.log(
                    `VAT ${vatRate.vatPercent}% (${vatRate.vatTypeLabel}) already exists for ${
                        vatRate.countryId === belgium.id ? 'Belgium' : 'France'
                    }.`
                );
            }
        }

        // 5. Charger et insérer les villes pour la Belgique
        console.log('Loading city data for Belgium...');
        const belgiumData = fs.readFileSync('public/datas/georef-belgium-postal-codes.json', 'utf-8');
        const belgiumJson = JSON.parse(belgiumData);

        const belgiumCities = Array.from(
            new Map(
                belgiumJson
                    .filter((item) => item.smun_name_fr && item.postcode)
                    .map((item) => [
                        item.postcode,
                        { cityCode: item.postcode, name: item.smun_name_fr, countryId: belgium.id },
                    ])
            ).values()
        );

        console.log(`Inserting ${belgiumCities.length} unique cities for Belgium into the database...`);

        for (const city of belgiumCities) {
            const existingCity = await prisma.city.findFirst({
                where: { cityCode: city.cityCode },
            });

            if (!existingCity) {
                await prisma.city.create({ data: city });
                console.log(`City "${city.name}" added for Belgium.`);
            } else {
                console.log(`City "${city.name}" already exists for Belgium.`);
            }
        }

        // 6. Charger et insérer les villes pour la France
        console.log('Loading city data for France...');
        const franceData = fs.readFileSync('public/datas/cities.json', 'utf-8');
        const franceJson = JSON.parse(franceData);

        const franceCities = Array.from(
            new Map(
                franceJson.cities
                    .filter((item) => item.label && item.zip_code)
                    .map((item) => [
                        item.zip_code,
                        { cityCode: item.zip_code, name: item.label, countryId: france.id },
                    ])
            ).values()
        );

        console.log(`Inserting ${franceCities.length} unique cities for France into the database...`);

        for (const city of franceCities) {
            const existingCity = await prisma.city.findFirst({
                where: { cityCode: city.cityCode },
            });

            if (!existingCity) {
                await prisma.city.create({ data: city });
                console.log(`City "${city.name}" added for France.`);
            } else {
                console.log(`City "${city.name}" already exists for France.`);
            }
        }

        console.log('Database seeding completed successfully.');
    } catch (error) {
        console.error('Error during database seeding:', error);
    } finally {
        await prisma.$disconnect();
    }
}

seedDatabase();
