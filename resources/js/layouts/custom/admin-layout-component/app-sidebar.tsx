import * as React from 'react';

import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
    SidebarRail,
} from '@/components/ui/sidebar';
import { Link } from '@inertiajs/react';

const data = {
    navMain: [
        {
            title: 'Transactions',
            url: '#',
            items: [
                {
                    title: 'View Transactions',
                    url: route('admin.transactions'),
                },
            ],
        },
        {
            title: 'Master Game',
            url: '#',
            items: [
                {
                    title: 'Add Game',
                    url: route('admin.games.create'),
                },
                {
                    title: 'View Games',
                    // url: '#',
                    url: route('admin.games'),
                },
            ],
        },
        {
            title: 'Master Voucher',
            url: '#',
            items: [
                // {
                //     title: 'Add Voucher',
                //     // url: '#',
                //     url: route('admin.vouchers.create'),
                // },
                {
                    title: 'View Vouchers',
                    // url: '#',
                    url: route('admin.vouchers'),
                },
            ],
        },
    ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    return (
        <Sidebar {...props}>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarMenu>
                        {data.navMain.map((item) => (
                            <SidebarMenuItem key={item.title}>
                                <SidebarMenuButton asChild>
                                    <Link href={item.url} className="font-medium">
                                        {item.title}
                                    </Link>
                                </SidebarMenuButton>
                                {item.items?.length ? (
                                    <SidebarMenuSub>
                                        {item.items.map((item) => (
                                            <SidebarMenuSubItem key={item.title}>
                                                <SidebarMenuSubButton asChild>
                                                    <Link href={item.url}>{item.title}</Link>
                                                </SidebarMenuSubButton>
                                            </SidebarMenuSubItem>
                                        ))}
                                    </SidebarMenuSub>
                                ) : null}
                            </SidebarMenuItem>
                        ))}
                    </SidebarMenu>
                </SidebarGroup>
            </SidebarContent>
            <SidebarRail />
        </Sidebar>
    );
}
