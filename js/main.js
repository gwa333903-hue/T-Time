// Ensure Firestore is initialized before this script runs
const db = firebase.firestore();

// Function to seed the database with initial menu items
async function seedDatabase() {
    const menuCollection = db.collection('menu');

    console.log('Clearing existing documents from menu collection...');
    const snapshot = await menuCollection.get();
    if (!snapshot.empty) {
        const batch = db.batch();
        snapshot.docs.forEach(doc => {
            batch.delete(doc.ref);
        });
        await batch.commit();
        console.log('Menu collection cleared.');
    }

    console.log('Seeding database with initial menu items...');

    // A list of menu items to add to the database
    const menuItems = [
        { name: 'Masala Chai', category: 'Tea', price: 2.50, description: 'A classic spiced tea.' },
        { name: 'Green Tea', category: 'Tea', price: 2.00, description: 'A light and refreshing tea.' },
        { name: 'Cappuccino', category: 'Coffee', price: 3.50, description: 'Espresso with steamed milk foam.' },
        { name: 'Latte', category: 'Coffee', price: 3.75, description: 'A creamy coffee drink.' },
        { name: 'Samosa', category: 'Snack', price: 1.50, description: 'A savory pastry with a spiced filling.' },
        { name: 'Muffin', category: 'Snack', price: 2.25, description: 'A sweet and moist baked good.' }
    ];

    // Create a batch write to add all items in a single operation
    const batch = db.batch();

    menuItems.forEach(item => {
        const docRef = menuCollection.doc(); // Firestore will auto-generate an ID
        batch.set(docRef, item);
    });

    // Commit the batch
    await batch.commit();

    console.log('Database seeded successfully!');
}
