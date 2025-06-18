"use client"

import { Link } from "@/lib/navigation"
import { Layout } from "antd"
import Image from "next/image"
import React, { useEffect } from "react"
import Logo from '@/assets/imgs/logo.svg'
import { LocaleDropdown } from "./LocaleDropdown"
import { ToggleTheme } from "./ToggleTheme"
import { Blog } from "@prisma/client"
import { useBlogStore } from "@/stores/blogStore"

const { Header, Content } = Layout

type BlogLayoutProps = {
    children: React.ReactNode;
    blog: Blog
}

const BlogLayout: React.FC<BlogLayoutProps> = ({ children, blog }) => {
    const { setBlog } = useBlogStore()

    useEffect(() => {
        setBlog(blog)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [blog])

    return (
        <Layout className="h-screen overflow-hidden">
                <Header className="flex justify-between bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-b-zinc-800">
                    <div className="flex items-center justify-between container px-8">
                        <Link href={`/${blog.slug}`}>
                            <Image
                                src={Logo}
                                alt="Logo - Blog"
                                width={150}
                                priority
                            />
                        </Link>
                    </div>
                    <Link href="/">
                        <Image
                            src={Logo}
                            alt="Logo - Blog"
                            width={150}
                            priority
                        />
                    </Link>
                    <div className="flex items-center gap-8">
                        <LocaleDropdown />
                        <ToggleTheme />
                    </div>
                </Header>
                <Content>
                    <div className="size-full flex items-center justify-center overflow-auto container px-8 mx-auto">
                        { children }
                    </div>
                </Content>
        </Layout>
    )
}

export default BlogLayout