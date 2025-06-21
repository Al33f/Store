import { PrismaClient } from '@/lib/generated/prisma';
import sampleData from './sample-data';

const prisma = new PrismaClient();

async function main(){
    await prisma.product.deleteMany({});
    await prisma.account.deleteMany({});
    await prisma.session.deleteMany({});
    await prisma.verificationToken.deleteMany({});
    await prisma.user.deleteMany({});

    await prisma.product.createMany({data: sampleData.products});
    await prisma.user.createMany({data: sampleData.users});

    console.log('Database seeded with sample data');
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
