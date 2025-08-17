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
    name: 'Dashboard',
    path: '/',
    icon: 'dashboard',
  },
  {
    name: 'الحجوزات',
    icon: 'shopping_bag',
    children: [
      { name: 'قائمة الحجوزات', isHeader: true },
      { name: 'الحجوزات الممددة', badge: 500, path: '/bookings' },
      { name: 'اشتراكات العملاء' },
      { name: 'الحجوزات المتأخره' },
      { name: 'الحجوزات المعلقة', icon: 'autorenew' },
      { name: 'الحجوزات المجدولة', icon: 'calendar_month' },
      { name: 'إلغاء التأجير', icon: 'close' },
    ],
  },
  {
    name: 'Shipments',
    icon: 'local_shipping',
    children: [
      { name: 'All' },
      { name: 'In Transit' },
      { name: 'Delivered' },
    ],
  },
  {
    name: 'Vehicles',
    icon: 'directions_car',
    children: [
      { name: 'Fleet' },
      { name: 'Maintenance' },
    ],
  },
  {
    name: 'Drivers',
    icon: 'badge',
    children: [
      { name: 'Directory' },
      { name: 'Schedules' },
    ],
  },
  {
    name: 'Clients',
    icon: 'group',
    children: [
      { name: 'List' },
      { name: 'Segments' },
    ],
  },
  {
    name: 'Reports',
    icon: 'bar_chart',
    children: [
      { name: 'Monthly', /* placeholder */ },
      { name: 'Yearly', /* placeholder */ },
    ],
  },
  {
    name: 'Finance',
    icon: 'attach_money',
    children: [
      { name: 'Invoices' },
      { name: 'Payments' },
    ],
  },
  {
    name: 'Settings',
    icon: 'settings',
    children: [
      { name: 'Profile', /* placeholder */ },
      { name: 'Users', /* placeholder */ },
    ],
  },
];
