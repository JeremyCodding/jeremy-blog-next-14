"use client"

import { Link, usePathname, useRouter } from "@/lib/navigation";
import { useBlogAdminStore } from "@/stores/blogAdminStore";
import { BlogWithUsers } from "@/types/Blog";
import { Button, Layout, Menu, MenuProps, Select, Breadcrumb, Spin } from "antd";
import { User } from "next-auth";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { DashboardOutlined, FileTextOutlined, MenuFoldOutlined, MenuUnfoldOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons'
import { hasPermission } from "@/lib/permissions";
import { BreadcrumbItemType } from "antd/es/breadcrumb/Breadcrumb";
import { getMyBlogs } from "@/server/admin/blogService";
import Image from "next/image";
import Logo from '@/assets/imgs/logo.svg'
import ShortLogo from '@/assets/imgs/shortLogo.svg'
import { LocaleDropdown } from "./LocaleDropdown"
import { ToggleTheme } from "./ToggleTheme"

type AdminLayoutProps = {
    children: React.ReactNode;
    blog: BlogWithUsers;
    user: User
}

const { Header, Content, Sider } = Layout;

const AdminLayout: React.FC<AdminLayoutProps> = ({children, blog, user}) => {
    const [collapsed, setCollapsed] = useState(false)
    const [restricted, setRestricted] = useState(true)
    const [loading, setLoading] = useState(true)

    const router = useRouter()
    const pathname = usePathname()
    const translations = useTranslations('Layout')
    const { blogs, setBlogs, setBlogSelected } = useBlogAdminStore()

    const handleCollapse = () => setCollapsed(!collapsed)

    const formatedPathName = '/' + pathname.split('/').slice(2).join('/')

    const handleChangeBlog = (slug: string) => {
        router.replace(`/${slug}/${formatedPathName}`)
    }

    const menuItems: MenuProps['items'] = [
        {
            key: '/admin',
            icon: <DashboardOutlined />,
            label: 'Dashboard',
            onClick: () => router.push(`/${blog.slug}/admin`),
        },
        {
            key: '/admin/posts',
            icon: <FileTextOutlined />,
            label: translations('posts'),
            onClick: () => router.push(`/${blog.slug}/admin/posts`),
        },
        {
            key: '/admin/users',
            icon: <UserOutlined />,
            label: translations('users'),
            disabled: !hasPermission({blogUsers: blog.users, userId: user.id!, roles: ['OWNER', 'ADMIN']}),
            onClick: () => router.push(`/${blog.slug}/admin/users`),
        },
        {
            key: '/admin/settings',
            icon: <SettingOutlined />,
            label: translations('settings'),
            disabled: !hasPermission({blogUsers: blog.users, userId: user.id!, roles: ['OWNER', 'ADMIN']}),
            onClick: () => router.push(`/${blog.slug}/admin/settings`),
        },
    ]

    const breadcrumbItems: {pathname: string, items: BreadcrumbItemType[]}[] = [
        {
            pathname: '/admin',
            items: [
                {
                    title: 'Dashboard',
                    href: '/admin'
                }
            ]
        },
        {
            pathname: '/admin/users',
            items: [
                {
                    title: 'Dashboard',
                    href: '/admin'
                },
                {
                    title: translations('users'),
                    href: '/admin/users'
                },
            ]
        },
        {
            pathname: '/admin/settings',
            items: [
                {
                    title: 'Dashboard',
                    href: '/admin'
                },
                {
                    title: translations('settings'),
                    href: '/admin/settings'
                },
            ]
        },
    ]

    useEffect(() => {
        setBlogSelected(blog)

        const handleGetBlogs = async () => {
            setLoading(true)
            const blogs = await getMyBlogs()
            setLoading(false)

            setBlogs(blogs.data)
        }

        handleGetBlogs()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [blog])

    useEffect(() => {
        if((formatedPathName.includes('/users') || formatedPathName.includes('/settings')) && !hasPermission({blogUsers: blog.users, userId: user.id!, roles: ['OWNER', 'ADMIN']})) {
            router.replace(`/${blog.slug}/admin`)
        } else {
            setRestricted(false)
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [blog, formatedPathName])

    return (
        <Layout className="h-screen overflow-hidden">
            <Sider 
                trigger={null}
                collapsible
                collapsed={collapsed}
                className="bg-white dark:bg-slate-950"
            >
                <Link 
                    href='/'
                    className="flex items-center justify-center border-b border-slate-200 dark:border-zinc-800 mb-4"
                >
                    <Image 
                        src={Logo} 
                        alt="Logo - Blog"
                        width={150}
                        className={`duration-300 absolute ${collapsed ? 'opacity-0' : 'opacity-100'}`}
                        priority
                    />
                    <Image 
                        src={ShortLogo} 
                        alt="Logo - Blog"
                        width={150}
                        className={`py-[13.5px] transition ${collapsed ? 'opacity-100' : 'opacity-0'}`}
                        priority
                    />
                </Link>

                <div className="px-2 pb-4 border-b border-slate-200 dark:border-b-zinc-800">
                    <Select 
                        showSearch
                        className="w-full"
                        defaultValue={blog.slug}
                        onChange={handleChangeBlog}
                        loading={loading}
                        options={blogs.map((blog) => ({
                            value: blog.slug,
                            label: blog.title,
                        }))}
                    />
                </div>

                <Menu
                    mode="inline"
                    defaultSelectedKeys={[formatedPathName]}
                    selectedKeys={[formatedPathName]}
                    items={menuItems}
                    className="h-full border-r-0 bg-white dark:bg-slate-950"
                />
            </Sider>
            <Layout
                className="dark:bg-slate-900"
            >
                <Header className="flex justify-between items-center p-0 pr-14 gap-4 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-b-zinc-800">
                    <Button
                        type="text"
                        icon={ collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined/> }
                        onClick={handleCollapse}
                        className="size-16"
                    />
                    <div className="flex items-center gap-5">
                        <LocaleDropdown />
                        <ToggleTheme />
                    </div>
                </Header>
                <Content 
                    className="px-4 pb-2 flex flex-col overflow-auto"
                >
                    <Breadcrumb 
                        className="my-3"
                        items={breadcrumbItems.find(item => item.pathname === formatedPathName)?.items || []}
                        itemRender={
                            (route) => (
                                <Link href={`/${blog.slug}${route.href || ''}`}>{route.title}</Link>
                            )
                        }
                    />

                    <div className="flex-1 relative rounded-lg bg-white dark:bg-slate-950">
                        <Spin
                            className="flex items-center justify-center size-full absolute bg-white dark:bg-slate-950"
                            spinning={restricted}
                            size="large"
                        />
                        {!restricted && children}
                    </div>
                </Content>
            </Layout>
        </Layout>
    )
}

export default AdminLayout