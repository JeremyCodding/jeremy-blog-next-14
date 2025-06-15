"use server"

import { auth } from "@/lib/auth"
import prisma from "@/lib/db"

export const getDashboardData = async ({ blogId }: { blogId: string }) => {
    const session = await auth()

    const totalUsers = await prisma.blogUser.count({
        where: {
            blogId,
        },
    })

    const totalPosts = await prisma.post.count({
        where: {
            blogId,
        },
    })

    const totalPostsMadeByUser = await prisma.post.count({
        where: {
            blogId,
            userId: session?.user?.id
        }
    })

    return {
        totalUsers,
        totalPosts,
        totalPostsMadeByUser
    }
}