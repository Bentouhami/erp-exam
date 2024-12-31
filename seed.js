const fs = require('fs');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function seedDatabase() {
    try {
        console.log('Seeding the database...');

        // 1. Ajouter ou vérifier le pays "Belgium"
        let country = await prisma.country.findUnique({
            where: { countryCode: 'BE', name: 'Belgium' },
        });

        if (!country) {
            country = await prisma.country.create({
                data: {
                    name: 'Belgium',
                    countryCode: 'BE',
                },
            });
            console.log('Country "Belgium" added.');
        } else {
            console.log('Country "Belgium" already exists.');
        }

        // 2. Ajouter ou vérifier les types de TVA
        const vatTypes = [
            { label: 'Reduced VAT' }, // TVA réduite
            { label: 'Standard VAT' }, // TVA normale
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

        // 3. Ajouter ou vérifier les taux de TVA
        const vatRates = [
            { vatTypeLabel: 'Reduced VAT', vatPercent: 6 }, // 6% pour TVA réduite
            { vatTypeLabel: 'Standard VAT', vatPercent: 21 }, // 21% pour TVA normale
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
                    countryId: country.id,
                    vatPercent: vatRate.vatPercent,
                },
            });

            if (!existingVat) {
                await prisma.vat.create({
                    data: {
                        vatTypeId: vatType.id,
                        countryId: country.id,
                        vatPercent: vatRate.vatPercent,
                    },
                });
                console.log(
                    `VAT ${vatRate.vatPercent}% (${vatRate.vatTypeLabel}) added for Belgium.`
                );
            } else {
                console.log(
                    `VAT ${vatRate.vatPercent}% (${vatRate.vatTypeLabel}) already exists for Belgium.`
                );
            }
        }

        // 4. Charger et insérer les villes
        console.log('Loading city data...');
        const data = fs.readFileSync('public/datas/georef-belgium-postal-codes.json', 'utf-8');
        const json = JSON.parse(data);

        const cities = Array.from(
            new Map(
                json
                    .filter((item) => item.smun_name_fr && item.postcode) // Assurez-vous d'avoir un nom et un code postal
                    .map((item) => [
                        item.postcode,
                        { cityCode: item.postcode, name: item.smun_name_fr, countryId: country.id },
                    ])
            ).values()
        );

        console.log(`Inserting ${cities.length} unique cities into the database...`);

        for (const city of cities) {
            const existingCity = await prisma.city.findFirst({
                where: { cityCode: city.cityCode },
            });

            if (!existingCity) {
                await prisma.city.create({ data: city });
                console.log(`City "${city.name}" added.`);
            } else {
                console.log(`City "${city.name}" already exists.`);
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
