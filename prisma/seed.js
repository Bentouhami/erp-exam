import fs from 'fs';
import {PrismaClient} from '@prisma/client';
import bcrypt from "bcryptjs";

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

        // // 2. Add or verify the country "France"
        // let france = await prisma.country.findUnique({
        //     where: {countryCode: 'FR'},
        // });
        //
        // if (!france) {
        //     france = await prisma.country.create({
        //         data: {
        //             name: 'France',
        //             countryCode: 'FR',
        //         },
        //     });
        //     console.log('Country "France" added.');
        // } else {
        //     console.log('Country "France" already exists.');
        // }

        // 3. Add or verify VAT rates
        const vatRates = [
            // Belgium VAT
            {vatType: 'REDUCED', vatPercent: 6, countryId: belgium.id},
            {vatType: 'STANDARD', vatPercent: 21, countryId: belgium.id},
            // // France VAT
            // {vatType: 'REDUCED', vatPercent: 5.5, countryId: france.id},
            // {vatType: 'STANDARD', vatPercent: 20, countryId: france.id},
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

        // // 5. Load and insert cities for France
        // console.log('Loading city data for France...');
        // const franceData = fs.readFileSync('public/datas/cities.json', 'utf-8');
        // const franceJson = JSON.parse(franceData);
        //
        // const franceCities = Array.from(
        //     new Map(
        //         franceJson.cities
        //             .filter((item) => item.label && item.zip_code)
        //             .map((item) => [
        //                 item.zip_code,
        //                 {cityCode: item.zip_code, name: item.label, countryId: france.id},
        //             ])
        //     ).values()
        // );
        //
        // console.log(`Inserting ${franceCities.length} unique cities for France...`);
        //
        // for (const city of franceCities) {
        //     const existingCity = await prisma.city.findFirst({
        //         where: {cityCode: city.cityCode},
        //     });
        //
        //     if (!existingCity) {
        //         await prisma.city.create({data: city});
        //         console.log(`City "${city.name}" added for France.`);
        //     } else {
        //         console.log(`City "${city.name}" already exists for France.`);
        //     }
        // }

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
                where: {name: unit.name},
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
            {label: 'Luxury Tax', utaxType: 'LUXURY'},
            {label: 'Environmental Tax', utaxType: 'SPECIAL'},
            {label: 'Health Tax', utaxType: 'SPECIAL'},
        ];

        console.log('Inserting common tax types...');

        for (const utax of commonUtaxes) {
            const existingUtax = await prisma.utax.findFirst({
                where: {label: utax.label},
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

        // Fetch Units, VATs, and Classes for Items
        const units = await prisma.unit.findMany();
        const vats = await prisma.vat.findMany();
        const itemClasses = await prisma.itemClass.findMany();

        if (!units.length || !vats.length || !itemClasses.length) {
            throw new Error('Units, VATs, or Item Classes are missing. Ensure they are seeded before seeding items.');
        }

        // Mock data for 10 items
        const items = [
            // The Original 10 items are here
            {
                label: "Sport Shoes",
                description: "High-quality running shoes.",
                purchasePrice: 50.0,
                retailPrice: 80.0,
                stockQuantity: 100,
                minQuantity: 10,
                vatId: vats[0].id,
                unitId: units[0].id,
                classId: itemClasses[0].id
            },
            {
                label: "Office Chair",
                description: "Ergonomic office chair.",
                purchasePrice: 150.0,
                retailPrice: 250.0,
                stockQuantity: 50,
                minQuantity: 5,
                vatId: vats[1].id,
                unitId: units[1].id,
                classId: itemClasses[1].id
            },
            {
                label: "Desk Lamp",
                description: "Adjustable desk lamp.",
                purchasePrice: 30.0,
                retailPrice: 60.0,
                stockQuantity: 200,
                minQuantity: 15,
                vatId: vats[0].id,
                unitId: units[2].id,
                classId: itemClasses[2].id
            },
            {
                label: "Bluetooth Headphones",
                description: "Noise-cancelling headphones.",
                purchasePrice: 100.0,
                retailPrice: 180.0,
                stockQuantity: 80,
                minQuantity: 10,
                vatId: vats[1].id,
                unitId: units[0].id,
                classId: itemClasses[0].id
            },
            {
                label: "Standing Desk",
                description: "Adjustable standing desk.",
                purchasePrice: 250.0,
                retailPrice: 400.0,
                stockQuantity: 20,
                minQuantity: 2,
                vatId: vats[0].id,
                unitId: units[1].id,
                classId: itemClasses[1].id
            },
            {
                label: "Gaming Chair",
                description: "Comfortable gaming chair.",
                purchasePrice: 200.0,
                retailPrice: 350.0,
                stockQuantity: 40,
                minQuantity: 5,
                vatId: vats[1].id,
                unitId: units[1].id,
                classId: itemClasses[1].id
            },
            {
                label: "Monitor 24 inch",
                description: "Full HD LED monitor.",
                purchasePrice: 120.0,
                retailPrice: 220.0,
                stockQuantity: 60,
                minQuantity: 8,
                vatId: vats[0].id,
                unitId: units[0].id,
                classId: itemClasses[2].id
            },
            {
                label: "Keyboard",
                description: "Mechanical keyboard.",
                purchasePrice: 80.0,
                retailPrice: 150.0,
                stockQuantity: 90,
                minQuantity: 10,
                vatId: vats[1].id,
                unitId: units[1].id,
                classId: itemClasses[0].id
            },
            {
                label: "Wireless Mouse",
                description: "Ergonomic wireless mouse.",
                purchasePrice: 40.0,
                retailPrice: 70.0,
                stockQuantity: 150,
                minQuantity: 20,
                vatId: vats[0].id,
                unitId: units[2].id,
                classId: itemClasses[0].id
            },
            {
                label: "Printer",
                description: "All-in-one wireless printer.",
                purchasePrice: 180.0,
                retailPrice: 300.0,
                stockQuantity: 30,
                minQuantity: 3,
                vatId: vats[1].id,
                unitId: units[0].id,
                classId: itemClasses[2].id
            },

            // New 10 items
            {
                label: "Smartwatch",
                description: "Waterproof smartwatch with GPS.",
                purchasePrice: 120.0,
                retailPrice: 250.0,
                stockQuantity: 70,
                minQuantity: 10,
                vatId: vats[0].id,
                unitId: units[0].id,
                classId: itemClasses[0].id
            },
            {
                label: "Electric Kettle",
                description: "1.5L electric kettle with auto shut-off.",
                purchasePrice: 25.0,
                retailPrice: 50.0,
                stockQuantity: 200,
                minQuantity: 30,
                vatId: vats[1].id,
                unitId: units[2].id,
                classId: itemClasses[2].id
            },
            {
                label: "Gaming Laptop",
                description: "High-performance laptop for gaming.",
                purchasePrice: 1000.0,
                retailPrice: 1500.0,
                stockQuantity: 15,
                minQuantity: 1,
                vatId: vats[0].id,
                unitId: units[1].id,
                classId: itemClasses[0].id
            },
            {
                label: "Electric Scooter",
                description: "Foldable electric scooter with long battery life.",
                purchasePrice: 400.0,
                retailPrice: 600.0,
                stockQuantity: 20,
                minQuantity: 2,
                vatId: vats[1].id,
                unitId: units[1].id,
                classId: itemClasses[1].id
            },
            {
                label: "Air Conditioner",
                description: "Energy-efficient air conditioner.",
                purchasePrice: 500.0,
                retailPrice: 800.0,
                stockQuantity: 10,
                minQuantity: 1,
                vatId: vats[1].id,
                unitId: units[2].id,
                classId: itemClasses[1].id
            },
            {
                label: "Microwave Oven",
                description: "Compact microwave oven with grill function.",
                purchasePrice: 100.0,
                retailPrice: 180.0,
                stockQuantity: 50,
                minQuantity: 5,
                vatId: vats[0].id,
                unitId: units[1].id,
                classId: itemClasses[2].id
            },
            {
                label: "Power Bank",
                description: "20,000mAh portable power bank.",
                purchasePrice: 20.0,
                retailPrice: 50.0,
                stockQuantity: 300,
                minQuantity: 50,
                vatId: vats[0].id,
                unitId: units[2].id,
                classId: itemClasses[0].id
            },
            {
                label: "Webcam",
                description: "1080p HD webcam with microphone.",
                purchasePrice: 30.0,
                retailPrice: 60.0,
                stockQuantity: 120,
                minQuantity: 10,
                vatId: vats[1].id,
                unitId: units[1].id,
                classId: itemClasses[0].id
            },
            {
                label: "Fitness Tracker",
                description: "Track steps, calories, and sleep patterns.",
                purchasePrice: 60.0,
                retailPrice: 100.0,
                stockQuantity: 80,
                minQuantity: 8,
                vatId: vats[0].id,
                unitId: units[0].id,
                classId: itemClasses[0].id
            },
            {
                label: "Coffee Maker",
                description: "Automatic coffee maker with timer.",
                purchasePrice: 70.0,
                retailPrice: 150.0,
                stockQuantity: 100,
                minQuantity: 10,
                vatId: vats[1].id,
                unitId: units[2].id,
                classId: itemClasses[2].id
            },
        ];


        console.log('Seeding items...');

        for (const item of items) {
            const itemNumber = await generateItemNumber();

            const existingItem = await prisma.item.findFirst({
                where: {itemNumber},
            });

            if (!existingItem) {
                await prisma.item.create({
                    data: {
                        itemNumber,
                        ...item,
                    },
                });
                console.log(`Item "${item.label}" added with number ${itemNumber}.`);
            } else {
                console.log(`Item "${item.label}" already exists.`);
            }
        }

        // ADD SUPER_ADMIN
        // Add Super Admin user
        const superAdminEmail = "bentouhami.faisal@gmail.com";
        const existingSuperAdmin = await prisma.user.findUnique({
            where: { email: superAdminEmail },
        });

        if (!existingSuperAdmin) {
            const userNumber = await generateUniqueUserNumber("SUPER_ADMIN"); // Generate user number for SUPER_ADMIN
            const superAdminData = {
                userNumber, // Include the generated user number
                firstName: "Bentouhami",
                lastName: "Faisal",
                name: "Bentouhami Faisal",
                email: superAdminEmail,
                phone: "+32456222054",
                mobile: "+32456222054",
                companyName: null,
                vatNumber: null,
                companyNumber: null,
                exportNumber: null,
                password: await saltAndHashPassword("Azerty1?"), // Securely hash password
                role: "SUPER_ADMIN",
                paymentTermDays: 0,
                isEnterprise: false,
                isVerified: true, // Mark as verified
            };

            await prisma.user.create({
                data: superAdminData,
            });

            console.log(`Super Admin user "${superAdminEmail}" created successfully with user number ${userNumber}.`);
        } else {
            console.log(`Super Admin user "${superAdminEmail}" already exists.`);
        }

        console.log('Database seeding completed successfully.');
    } catch (error) {
        console.error('Error during database seeding:', error);
    } finally {
        await prisma.$disconnect();
    }
}

async function generateItemNumber() {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');

    const lastItem = await prisma.item.findFirst({
        where: {
            itemNumber: {
                startsWith: `ITM${year}${month}`,
            },
        },
        orderBy: {
            itemNumber: 'desc',
        },
    });

    let sequenceNumber;

    if (!lastItem) {
        sequenceNumber = 1;
    } else {
        const lastSequence = parseInt(lastItem.itemNumber.slice(-6), 10);
        sequenceNumber = lastSequence + 1;
    }

    return `ITM${year}${month}${sequenceNumber.toString().padStart(6, '0')}`;
}

async function saltAndHashPassword(password) {
    return new Promise((resolve, reject) => {
        // Utiliser bcrypt pour générer un salt avec 10 rounds (nombre de tours recommandé)
        bcrypt.genSalt(10, (err, salt) => {
            if (err) return reject(err);

            // Utiliser le salt généré pour hashes le mot de passe
            bcrypt.hash(password, salt, (err, hashedPassword) => {
                if (err) return reject(err);
                resolve(hashedPassword);
            });
        });
    });
}

async function generateUniqueUserNumber(userRole) {

    let userPrefix = ""; // Prefix for user numbers
    if (userRole === "ADMIN") {
        userPrefix = "ADM";
    } else if (userRole === "CUSTOMER") {
        userPrefix = "CUS";
    } else if (userRole === "SUPER_ADMIN") {
        userPrefix = "SAD";
    } else if (userRole === "ACCOUNTANT") {
        userPrefix = "ACC";
    }

    const paddingLength = 6; // Length of the number portion (e.g., U000001)

    // Find the latest user based on userNumber
    const latestUser = await prisma.user.findFirst({
        where: {
            userNumber: {
                startsWith: userPrefix,
            },
        },
        orderBy: {
            userNumber: "desc",
        },
    });

    let nextNumber = 1; // Default to 1 if no users exist

    if (latestUser && latestUser.userNumber) {
        // Extract the numeric part from the latest userNumber
        const latestNumber = parseInt(latestUser.userNumber.slice(userPrefix.length), 10);
        nextNumber = latestNumber + 1;
    }

    // Generate the new userNumber with zero-padded numeric part
    const userNumber = `${userPrefix}${nextNumber.toString().padStart(paddingLength, "0")}`;
    return userNumber;
}

seedDatabase();
