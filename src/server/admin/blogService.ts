"use server"

import { auth } from "@/lib/auth"
import prisma from "@/lib/db"
import { redirect } from "@/lib/navigation"
import { User } from "next-auth"
import { revalidatePath } from "next/cache"

export const getMyBlogs = async () => {
    const user = await auth()

    const blogs = await prisma.blog.findMany({
        where: {
            users: { some: { userId: user?.user?.id } },
            deleteAt: null,
        }
    })

    return { data: blogs }
}

export type CreateUpdetaBlogType = { 
    title: string, 
    subtitle: string, 
    slug: string, 
    bgColor: string, 
    textColor: string
}

export const createBlog = async ({ data }: { data: CreateUpdetaBlogType}) => {
    const user = await auth()

    const slugExists = await prisma.blog.findFirst({
        where: {
            slug: data.slug,
        }
    })

    if(slugExists) return { error: 'SLUG_ALREADY_EXISTS' }

    const blog = await prisma.blog.create({
        data: {
            ...data,
            // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
            users: { create: [{role: 'OWNER', userId: user?.user?.id! }]}
        }
    })

    revalidatePath('/')
    redirect(`/${blog.slug}/admin`)
}

export const updateBlog = async ({ blogId, data }: { blogId: string, data: CreateUpdetaBlogType}) => {
    const blog = await prisma.blog.findFirst({
        where: {
            id: blogId,
        },
        select: {
            slug: true,
        }
    })

    if(blog?.slug !== data.slug) {
        if(await prisma.blog.count({ where: { slug: data.slug } }) > 0) {
            return { error: 'SLUG_ALREADY_EXISTS'}
        }
    }

    await prisma.blog.update({
        where: {
            id: blogId,
        },
        data
    })

    revalidatePath('/admin/settings')

    if(blog?.slug !== data.slug) {
        redirect(`/${data.slug}/admin/settings`)
    }
}

export const getBlog = async ({ slug, user }: { slug: string, user: User}) => {
    const blog = await prisma.blog.findFirst({
        where: {
            slug,
            deleteAt: null,
        },
        include: {
            users: {
                where: {
                    userId: user.id,
                }
            }
        }
    })

    const blogBelongsToUser = blog?.users.some(data => data.userId === user.id)

    if(!blog || !blogBelongsToUser) return { error: 'BLOG_NOT_FOUND' }

    return { data: blog }
}

export const deleteBlog = async ({ blogId }: { blogId: string}) => {
    await prisma.blog.update({
        where: {
            id: blogId,
        },
        data: {
            deleteAt: new Date()
        }
    })

    redirect('/')
}