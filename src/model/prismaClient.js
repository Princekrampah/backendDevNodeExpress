const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
// https://www.prisma.io/docs/concepts/components/prisma-client

module.exports = prisma;
