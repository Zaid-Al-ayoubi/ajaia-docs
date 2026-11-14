import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  // نمسح أي بيانات قديمة عشان ما يتكرروا
  await prisma.share.deleteMany()
  await prisma.document.deleteMany()
  await prisma.user.deleteMany()

  // نضيف 3 مستخدمين
  const alice = await prisma.user.create({
    data: { email: 'alice@ajaia.test', name: 'Alice' },
  })
  const bob = await prisma.user.create({
    data: { email: 'bob@ajaia.test', name: 'Bob' },
  })
  const carol = await prisma.user.create({
    data: { email: 'carol@ajaia.test', name: 'Carol' },
  })

  console.log({ alice, bob, carol })
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