"use server"

import { auth } from "@/lib/auth"
import prisma from "@/lib/db"
import { getBlogUser } from "@/server/admin/blogUserService"
import { revalidatePath } from "next/cache"

export type CreateBlogPostType = {
    title: string, 
    subtitle: string, 
    slug: string,
    body: string,
    blogId: string
}

export const getBlogPosts = async ({ blogSlug }: { blogSlug: string }) => {
    const session = await auth()
    const user = session?.user

    if (!user) return { error: 'UNAUTHORIZED' }

    const blog = await prisma.blog.findUnique({
        where: {
            slug: blogSlug,
        },
        select: {
            id: true,
        }
    })

    if (!blog) return { error: 'BLOG_NOT_FOUND' }

    const blogUser = await getBlogUser({ userId: user.id!, blogId: blog.id!})

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let where: Record<string, any> = {
        blog: { slug: blogSlug },
        deletedAt: null,
    }

    if (blogUser.data?.role === "AUTHOR") {
        where = {
            ...where,
            userId: user.id
        }
    }

    const blogPosts = await prisma.post.findMany({
        where,
        include: {
            user: true
        }
    })

    return { data: blogPosts }
}

export const createBlogPost = async ({ data }: { data: CreateBlogPostType}) => {
    const session = await auth()
    const user = session?.user

    if (!user) return { error: 'UNAUTHORIZED' }
    if (!user.id) return { error: 'UNAUTHORIZED' }

    const postExists = await prisma.post.count({
        where: {
            slug: data.slug,
        },
    })

    if (postExists) return { error: 'SLUG_ALREADY_EXISTS' }

    await prisma.post.create({
        data: {
            ...data,
            userId: user.id!
        }
    })

    revalidatePath('/admin/posts')
}

export const updateBlogPost = async ({ postId, data }: { postId: string, data: CreateBlogPostType}) => {
    const post = await prisma.post.findUnique({
        where: {
            id: postId,
        }
    })

    if(post?.slug !== data.slug) {
        if(await prisma.blog.count({ where: { slug: data.slug } }) > 0) {
            return { error: 'SLUG_ALREADY_EXISTS'}
        }
    }

    await prisma.post.update({
        where: {
            id: postId,
        },
        data,
    })

    revalidatePath('/admin/posts')
}

export const deleteBlogPost = async ({ postId }: { postId: string}) => {
    await prisma.post.update({
        where: {
            id: postId,
        },
        data: {
            deleteAt: new Date()
        }
    })

    revalidatePath('/admin/posts')
}