"use client"

import { Link, usePathname } from "@/lib/navigation"
import { Dropdown, Space } from "antd"
import { useLocale } from "next-intl"
import Image from "next/image"
import { CaretDownFilled } from '@ant-design/icons'
import { intl } from "@/config/intl"

export const LocaleDropdown = () => {
    const pathname = usePathname()
    const locale = useLocale()

    return (
        <Dropdown
            menu={{
                items: intl.localeList.map(data => {
                    return {
                        key: data.locale,
                        label:<Link href={pathname} locale={data.locale}>
                                {data.locale}
                            </Link>,
                        icon: <Image src={`/imgs/${data.locale}.svg`} width={23} height={23} alt={locale} />,
                        defaultSelectedKeys: [locale]
                    }
                })
            }}
        >
            <Space className="border border-slate-200 dark:border-zinc-800 rounded-md h-9 px-3 cursor-pointer gap-4">
                <Image src={`/imgs/${locale}.svg`} width={23} height={23} alt={locale} />
                <CaretDownFilled className="text-slate-600" />
            </Space>
        </Dropdown>
    )
}