import { LucideIcon } from 'lucide-react';
import type { Config } from 'ziggy-js';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    ziggy: Config & { location: string };
    sidebarOpen: boolean;
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    [key: string]: unknown; // This allows for additional properties...
}

export type PaginatedResponse<T> = {
    current_page: number;
    data: T[];
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    links: PaginationLink[];
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
};

export type Game = {
    id: string;
    logo: string;
    name: string;
    company: string;
    how_to: string;
    topup_data: string[];
    created_at: string;
    slug: string;
    category_voucher: CategoryVoucher[];
    updated_at: string;
    deleted_at: string | null;
};

export type CategoryVoucher = {
    id: string;
    name?: string;
    created_at: string;
    updated_at: string;
    game: Game | null;
    packages: Package[] | null;
};

export type Package = {
    id: string;
    name: string;
    price: number;
    quantity: number;
    created_at: string;
    updated_at: string;
};

export type Voucher = {
    id: string;
    package_id: string;
    voucher_code: string;
    used_at: string | null;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    package: Package | null; // 👈 updated to nested structure
};
