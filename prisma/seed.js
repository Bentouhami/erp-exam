import fs from 'fs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedDatabase() {
    try {
        console.log('Seeding the database...');

        // 1. Add or verify the country "Belgium"
        let belgium = await prisma.country.findUnique({
            where: {countryCode: 'BE'},
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

        // 2. Add or verify the country "France"
        let france = await prisma.country.findUnique({
            where: {countryCode: 'FR'},
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

        // 3. Add or verify VAT rates
        const vatRates = [
            // Belgium VAT
            {vatType: 'REDUCED', vatPercent: 6, countryId: belgium.id},
            {vatType: 'STANDARD', vatPercent: 21, countryId: belgium.id},
            // France VAT
            {vatType: 'REDUCED', vatPercent: 5.5, countryId: france.id},
            {vatType: 'STANDARD', vatPercent: 20, countryId: france.id},
        ];

        for (const vatRate of vatRates) {
            const existingVat = await prisma.vat.findFirst({
                where: {
                    vatType: vatRate.vatType,
                    countryId: vatRate.countryId,
                    vatPercent: vatRate.vatPercent,
                },
            });

            if (!existingVat) {
                await prisma.vat.create({
                    data: vatRate,
                });
                console.log(
                    `VAT ${vatRate.vatPercent}% (${vatRate.vatType}) added for ${
                        vatRate.countryId === belgium.id ? 'Belgium' : 'France'
                    }.`
                );
            } else {
                console.log(
                    `VAT ${vatRate.vatPercent}% (${vatRate.vatType}) already exists for ${
                        vatRate.countryId === belgium.id ? 'Belgium' : 'France'
                    }.`
                );
            }
        }

        // 4. Load and insert cities for Belgium
        console.log('Loading city data for Belgium...');
        const belgiumData = fs.readFileSync(
            'public/datas/georef-belgium-postal-codes.json',
            'utf-8'
        );
        const belgiumJson = JSON.parse(belgiumData);

        const belgiumCities = Array.from(
            new Map(
                belgiumJson
                    .filter((item) => item.smun_name_fr && item.postcode)
                    .map((item) => [
                        item.postcode,
                        {cityCode: item.postcode, name: item.smun_name_fr, countryId: belgium.id},
                    ])
            ).values()
        );

        console.log(`Inserting ${belgiumCities.length} unique cities for Belgium...`);

        for (const city of belgiumCities) {
            const existingCity = await prisma.city.findFirst({
                where: {cityCode: city.cityCode},
            });

            if (!existingCity) {
                await prisma.city.create({data: city});
                console.log(`City "${city.name}" added for Belgium.`);
            } else {
                console.log(`City "${city.name}" already exists for Belgium.`);
            }
        }

        // 5. Load and insert cities for France
        console.log('Loading city data for France...');
        const franceData = fs.readFileSync('public/datas/cities.json', 'utf-8');
        const franceJson = JSON.parse(franceData);

        const franceCities = Array.from(
            new Map(
                franceJson.cities
                    .filter((item) => item.label && item.zip_code)
                    .map((item) => [
                        item.zip_code,
                        {cityCode: item.zip_code, name: item.label, countryId: france.id},
                    ])
            ).values()
        );

        console.log(`Inserting ${franceCities.length} unique cities for France...`);

        for (const city of franceCities) {
            const existingCity = await prisma.city.findFirst({
                where: {cityCode: city.cityCode},
            });

            if (!existingCity) {
                await prisma.city.create({data: city});
                console.log(`City "${city.name}" added for France.`);
            } else {
                console.log(`City "${city.name}" already exists for France.`);
            }
        }

        // 6. Add or verify common units
        const commonUnits = [
            {name: 'Pièce'},      // Piece
            {name: 'Kilogramme'}, // Kilogram
            {name: 'Litre'},      // Liter
            {name: 'Mètre'},      // Meter
            {name: 'Centimètre'}, // Centimeter
            {name: 'Gramme'},     // Gram
            {name: 'Boîte'},      // Box
            {name: 'Paquet'},     // Package
        ];

        console.log('Inserting common units...');

        for (const unit of commonUnits) {
            const existingUnit = await prisma.unit.findFirst({
                where: { name: unit.name },
            });

            if (!existingUnit) {
                await prisma.unit.create({
                    data: unit,
                });
                console.log(`Unit "${unit.name}" added.`);
            } else {
                console.log(`Unit "${unit.name}" already exists.`);
            }
        }


        // 7. Add or verify common item classes
        const commonItemClasses = [
            {label: 'Électronique'},    // Electronics
            {label: 'Mobilier'},        // Furniture
            {label: 'Vêtements'},       // Clothing
            {label: 'Alimentation'},    // Food
            {label: 'Accessoires'},     // Accessories
            {label: 'Jouets'},          // Toys
            {label: 'Outils'},          // Tools
            {label: 'Livres'},          // Books
        ];

        console.log('Inserting common item classes...');

        for (const itemClass of commonItemClasses) {
            const existingItemClass = await prisma.itemClass.findFirst({
                where: {label: itemClass.label},
            });

            if (!existingItemClass) {
                await prisma.itemClass.create({
                    data: itemClass,
                });
                console.log(`Item class "${itemClass.label}" added.`);
            } else {
                console.log(`Item class "${itemClass.label}" already exists.`);
            }
        }

        // 8. Add or verify common tax types (Utax)
        const commonUtaxes = [
            { label: 'Luxury Tax', utaxType: 'LUXURY' },
            { label: 'Environmental Tax', utaxType: 'SPECIAL' },
            { label: 'Health Tax', utaxType: 'SPECIAL' },
        ];

        console.log('Inserting common tax types...');

        for (const utax of commonUtaxes) {
            const existingUtax = await prisma.utax.findFirst({
                where: { label: utax.label },
            });

            if (!existingUtax) {
                await prisma.utax.create({
                    data: utax,
                });
                console.log(`Tax type "${utax.label}" added.`);
            } else {
                console.log(`Tax type "${utax.label}" already exists.`);
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
