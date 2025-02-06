import {PrismaClient} from '@prisma/client';
import bcrypt from "bcryptjs";
import fs from "fs";

const prisma = new PrismaClient();

async function seedDatabase() {
    try {
        console.log(' 🌍 Seeding the database...');

        //region Countries and cities
        const countries = [{name: 'Belgium', countryCode: 'BE'}, {name: 'France', countryCode: 'FR'}];

        for (const countryData of countries) {
            await prisma.country.upsert({
                where: {countryCode: countryData.countryCode}, update: {}, create: countryData
            });
        }

        const belgium = await prisma.country.findUnique({where: {countryCode: 'BE'}});
        const france = await prisma.country.findUnique({where: {countryCode: 'FR'}});

        console.log(' 🌍 Countries seeded.');

        // 4. Load and insert cities for Belgium
        console.log('Loading city data for Belgium...');
        const belgiumData = fs.readFileSync('public/datas/georef-belgium-postal-codes.json', 'utf-8');
        const belgiumJson = JSON.parse(belgiumData);

        const belgiumCities = Array.from(new Map(belgiumJson
            .filter((item) => item.smun_name_fr && item.postcode)
            .map((item) => [item.postcode, {
                cityCode: item.postcode,
                name: item.smun_name_fr,
                countryId: belgium.id
            },])).values());

        console.log(`Inserting ${belgiumCities.length} unique cities for Belgium...`);

        for (const city of belgiumCities) {
            const existingCity = await prisma.city.findFirst({
                where: {cityCode: city.cityCode},
            });

            if (!existingCity) {
                await prisma.city.create({data: city});
                console.log(`City "${city.name}" added for Belgium.`);
            }
        }

        // 5. Load and insert cities for France
        console.log('Loading city data for France...');
        const franceData = fs.readFileSync('public/datas/cities.json', 'utf-8');
        const franceJson = JSON.parse(franceData);

        const franceCities = Array.from(new Map(franceJson.cities
            .filter((item) => item.label && item.zip_code)
            .map((item) => [item.zip_code, {
                cityCode: item.zip_code,
                name: item.label,
                countryId: france.id
            },])).values());

        console.log(`Inserting ${franceCities.length} unique cities for France...`);

        for (const city of franceCities) {
            const existingCity = await prisma.city.findFirst({
                where: {cityCode: city.cityCode},
            });

            if (!existingCity) {
                await prisma.city.create({data: city});
                console.log(`City "${city.name}" added for France.`);
            }
        }
        //endregion

        //region VAT Rates by country and item class
        const vatRates = [// Belgium
            {countryId: belgium.id, vatPercent: 6.00, itemClassLabel: 'Alimentation'}, {
                countryId: belgium.id,
                vatPercent: 21.00,
                itemClassLabel: 'Électronique'
            }, {countryId: belgium.id, vatPercent: 21.00, itemClassLabel: 'Mobilier'}, {
                countryId: belgium.id,
                vatPercent: 21.00,
                itemClassLabel: 'Vêtements'
            }, {countryId: belgium.id, vatPercent: 6.00, itemClassLabel: 'Livres'}, // France
            {countryId: france.id, vatPercent: 5.50, itemClassLabel: 'Alimentation'}, {
                countryId: france.id,
                vatPercent: 20.00,
                itemClassLabel: 'Électronique'
            }, {countryId: france.id, vatPercent: 20.00, itemClassLabel: 'Mobilier'}, {
                countryId: france.id,
                vatPercent: 20.00,
                itemClassLabel: 'Vêtements'
            }, {countryId: france.id, vatPercent: 5.50, itemClassLabel: 'Livres'},];

        for (const vatRate of vatRates) {
            // Upsert the ItemClass so it definitely exists
            let itemClass = await prisma.itemClass.upsert({
                where: {label: vatRate.itemClassLabel}, update: {}, create: {label: vatRate.itemClassLabel}
            });

            // Upsert the VatRate
            await prisma.vatRate.upsert({
                where: {
                    countryId_itemClassId: {
                        countryId: vatRate.countryId, itemClassId: itemClass.id
                    }
                }, update: {}, create: {
                    countryId: vatRate.countryId, itemClassId: itemClass.id, vatPercent: vatRate.vatPercent
                }
            });
        }

        console.log('VAT rates seeded.');
        // //endregion

        //region Units
        const units = [{name: 'Pièce'}, {name: 'Kilogramme'}, {name: 'Litre'}, {name: 'Mètre'}, {name: 'Centimètre'}, {name: 'Gramme'}, {name: 'Boîte'}, {name: 'Paquet'}, {name: 'Carton'}, {name: 'Sac'}];

        for (const unit of units) {
            await prisma.unit.upsert({
                where: {name: unit.name}, update: {}, create: unit
            });
        }

        console.log('Units seeded.');
        //endregion

        //region Items
        // Mock data for 10 items
        const items = [// --- The original 12 from your new script ---
            {
                label: "Sport Shoes",
                description: "High-quality running shoes",
                retailPrice: 80.00,
                purchasePrice: 50.00,
                stockQuantity: 100,
                minQuantity: 10,
                classLabel: "Vêtements",   // Clothing
                unitName: "Pièce"
            }, {
                label: "Office Chair",
                description: "Ergonomic office chair",
                retailPrice: 250.00,
                purchasePrice: 180.00,
                stockQuantity: 50,
                minQuantity: 5,
                classLabel: "Mobilier",    // Furniture
                unitName: "Pièce"
            }, {
                label: "Desk Lamp",
                description: "Adjustable desk lamp",
                retailPrice: 60.00,
                purchasePrice: 30.00,
                stockQuantity: 200,
                minQuantity: 15,
                classLabel: "Électronique",
                unitName: "Pièce"
            }, {
                label: "Bluetooth Headphones",
                description: "Noise-cancelling headphones",
                retailPrice: 180.00,
                purchasePrice: 100.00,
                stockQuantity: 80,
                minQuantity: 10,
                classLabel: "Électronique",
                unitName: "Pièce"
            }, {
                label: "Standing Desk",
                description: "Adjustable standing desk",
                retailPrice: 400.00,
                purchasePrice: 250.00,
                stockQuantity: 20,
                minQuantity: 2,
                classLabel: "Mobilier",
                unitName: "Pièce"
            }, {
                label: "Gaming Chair",
                description: "Comfortable gaming chair",
                retailPrice: 350.00,
                purchasePrice: 200.00,
                stockQuantity: 40,
                minQuantity: 5,
                classLabel: "Mobilier",
                unitName: "Pièce"
            }, {
                label: "Monitor 24 inch",
                description: "Full HD LED monitor",
                retailPrice: 220.00,
                purchasePrice: 120.00,
                stockQuantity: 60,
                minQuantity: 8,
                classLabel: "Électronique",
                unitName: "Pièce"
            }, {
                label: "Keyboard",
                description: "Mechanical keyboard",
                retailPrice: 150.00,
                purchasePrice: 80.00,
                stockQuantity: 90,
                minQuantity: 10,
                classLabel: "Électronique",
                unitName: "Pièce"
            }, {
                label: "Wireless Mouse",
                description: "Ergonomic wireless mouse",
                retailPrice: 70.00,
                purchasePrice: 40.00,
                stockQuantity: 150,
                minQuantity: 20,
                classLabel: "Électronique",
                unitName: "Pièce"
            }, {
                label: "Printer",
                description: "All-in-one wireless printer",
                retailPrice: 300.00,
                purchasePrice: 180.00,
                stockQuantity: 30,
                minQuantity: 3,
                classLabel: "Électronique",
                unitName: "Pièce"
            }, {
                label: "Book",
                description: "Best-selling novel",
                retailPrice: 20.00,
                purchasePrice: 10.00,
                stockQuantity: 30,
                minQuantity: 5,
                classLabel: "Livres",
                unitName: "Pièce"
            }, {
                label: "Bread",
                description: "Fresh bread",
                retailPrice: 5.00,
                purchasePrice: 3.00,
                stockQuantity: 50,
                minQuantity: 5,
                classLabel: "Alimentation",
                unitName: "Kilogramme"
            },

            // --- 10 Missing items from the old script ---
            {
                label: "Smartwatch",
                description: "Waterproof smartwatch with GPS.",
                purchasePrice: 120.0,
                retailPrice: 250.0,
                stockQuantity: 70,
                minQuantity: 10,
                classLabel: "Électronique",
                unitName: "Pièce"
            }, {
                label: "Electric Kettle",
                description: "1.5L electric kettle with auto shut-off.",
                purchasePrice: 25.0,
                retailPrice: 50.0,
                stockQuantity: 200,
                minQuantity: 30,
                classLabel: "Électronique",
                unitName: "Pièce"
            }, {
                label: "Gaming Laptop",
                description: "High-performance laptop for gaming.",
                purchasePrice: 1000.0,
                retailPrice: 1500.0,
                stockQuantity: 15,
                minQuantity: 1,
                classLabel: "Électronique",
                unitName: "Pièce"
            }, {
                label: "Electric Scooter",
                description: "Foldable electric scooter with long battery life.",
                purchasePrice: 400.0,
                retailPrice: 600.0,
                stockQuantity: 20,
                minQuantity: 2,
                classLabel: "Électronique",
                unitName: "Pièce"
            }, {
                label: "Air Conditioner",
                description: "Energy-efficient air conditioner.",
                purchasePrice: 500.0,
                retailPrice: 800.0,
                stockQuantity: 10,
                minQuantity: 1,
                classLabel: "Électronique",
                unitName: "Pièce"
            }, {
                label: "Microwave Oven",
                description: "Compact microwave oven with grill function.",
                purchasePrice: 100.0,
                retailPrice: 180.0,
                stockQuantity: 50,
                minQuantity: 5,
                classLabel: "Électronique",
                unitName: "Pièce"
            }, {
                label: "Power Bank",
                description: "20,000mAh portable power bank.",
                purchasePrice: 20.0,
                retailPrice: 50.0,
                stockQuantity: 300,
                minQuantity: 50,
                classLabel: "Électronique",
                unitName: "Pièce"
            }, {
                label: "Webcam",
                description: "1080p HD webcam with microphone.",
                purchasePrice: 30.0,
                retailPrice: 60.0,
                stockQuantity: 120,
                minQuantity: 10,
                classLabel: "Électronique",
                unitName: "Pièce"
            }, {
                label: "Fitness Tracker",
                description: "Track steps, calories, and sleep patterns.",
                purchasePrice: 60.0,
                retailPrice: 100.0,
                stockQuantity: 80,
                minQuantity: 8,
                classLabel: "Électronique",
                unitName: "Pièce"
            }, {
                label: "Coffee Maker",
                description: "Automatic coffee maker with timer.",
                purchasePrice: 70.0,
                retailPrice: 150.0,
                stockQuantity: 100,
                minQuantity: 10,
                classLabel: "Électronique",
                unitName: "Pièce"
            }];

        console.log(' 🔥 Seeding items...');
        for (const item of items) {
            const itemNumber = await generateItemNumber();

            // Find the corresponding unit and item class
            const unit = await prisma.unit.findFirst({
                where: {name: item.unitName}
            });

            const itemClass = await prisma.itemClass.findFirst({
                where: {label: item.classLabel}
            });
            // Check if the item already exists to avoid duplicates
            const existingItem = await prisma.item.findFirst({
                where: {itemNumber},
            });

            if (!existingItem) {
                await prisma.item.create({
                    data: {
                        itemNumber,
                        label: item.label,
                        description: item.description,
                        purchasePrice: item.purchasePrice,
                        retailPrice: item.retailPrice,
                        stockQuantity: item.stockQuantity,
                        minQuantity: item.minQuantity,
                        unitId: unit.id,
                        classId: itemClass.id
                    }
                });
                console.log(`Created NEW item "${item.label}" with item number ${itemNumber}`);
            }
        }

        console.log(' 📦 Items seeded');
        //endregion

        //region SUPER_ADMIN
        // Add Super Admin user
        console.log('👥 Seeding users...');
        const usersToSeed = [{
            email: 'bentouhami.faisal@gmail.com',
            role: 'SUPER_ADMIN',
            firstName: 'Bentouhami',
            lastName: 'Faisal',
            password: 'Azerty1?',
            phone: '+32456222054',
            mobile: '+32456222054',
            isVerified: true,
            emailVerified: new Date(),

        }, {
            email: 'family.zaki1@gmail.com',
            role: 'ADMIN',
            firstName: 'Family',
            lastName: 'Zaki',
            password: 'Azerty1?',
            phone: '+32456123450',
            mobile: '+32456123450',
            isVerified: true,
            emailVerified: new Date(),

        }, {
            email: 'bentouhami.fa@gmail.com',
            role: 'ACCOUNTANT',
            firstName: 'Bentouhami',
            lastName: 'Fa',
            password: 'Azerty1?',
            phone: '+32456987651',
            mobile: '+32456987651',
            isVerified: true,
            emailVerified: new Date(),

        },];

        for (const user of usersToSeed) {
            await createUserIfNotExists(user);
        }

        console.log('✅ Users seeded.');

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
        }, orderBy: {
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
        }, orderBy: {
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

/**
 * Creates a user if they do not already exist.
 * @param {Object} userData - The data of the user to create.
 * @param {string} userData.email - The email of the user.
 * @param {string} userData.role - The role of the user (e.g., "SUPER_ADMIN").
 * @param {string} userData.firstName - The first name of the user.
 * @param {string} userData.lastName - The last name of the user.
 * @param {string} userData.password - The plain text password of the user.
 * @param {string} [userData.phone] - The phone number of the user.
 * @param {string} [userData.mobile] - The mobile number of the user.
 * @param {boolean} [userData.isVerified] - Whether the user is verified.
 * @param {boolean} [userData.isEnterprise] - Whether the user is an enterprise.
 * @param {number} [userData.paymentTermDays] - Payment term days.
 * @param {string} [userData.companyName] - The company name.
 * @param {string} [userData.vatNumber] - The VAT number.
 * @param {string} [userData.companyNumber] - The company number.
 * @param {string} [userData.exportNumber] - The export number.
 */
async function createUserIfNotExists(userData) {
    const {
        email,
        role,
        firstName,
        lastName,
        password,
        phone = null,
        mobile = null,
        isVerified = false,
        isEnterprise = false,
        paymentTermDays = 0,
        companyName = null,
        vatNumber = null,
        companyNumber = null,
        exportNumber = null,
        emailVerified,
    } = userData;

    try {
        const existingUser = await prisma.user.findUnique({
            where: {email},
        });

        if (!existingUser) {
            const userNumber = await generateUniqueUserNumber(role);
            const hashedPassword = await saltAndHashPassword(password);

            const newUser = await prisma.user.create({
                data: {
                    userNumber,
                    firstName,
                    lastName,
                    name: `${firstName} ${lastName}`,
                    email,
                    phone,
                    mobile,
                    companyName,
                    vatNumber,
                    companyNumber,
                    exportNumber,
                    password: hashedPassword,
                    role,
                    paymentTermDays,
                    isEnterprise,
                    isVerified,
                    emailVerified,
                },
            });

            console.log(`✅ ${role.replace('_', ' ')} "${email}" created successfully with user number ${userNumber}.`);
        } else {
            console.log(`ℹ️ ${role.replace('_', ' ')} "${email}" already exists.`);
        }
    } catch (error) {
        console.error(`❌ Error creating ${role.replace('_', ' ')} "${email}":`, error);
    }
}

seedDatabase();
