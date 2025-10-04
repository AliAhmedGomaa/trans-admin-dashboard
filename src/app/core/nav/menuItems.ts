export interface NavItem {
  name: string;
  path?: string;
  icon?: string;
  children?: NavItem[];
  badge?: number;
  isHeader?: boolean;
}

export const menuItems: NavItem[] = [
  {
    name: 'المكاتب',
    path: '/offices',
    icon: 'store',
  },
  {
    name: 'السيارات',
    path: '/cars',
    icon: 'directions_car',
  },
  {
    name: 'الحجوزات',
    path: '/bookings',
    icon: 'shopping_bag',
  },
];
