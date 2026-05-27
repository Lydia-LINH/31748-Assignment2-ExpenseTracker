import { 
  Wallet, DollarSign, Briefcase, Home, Hotel, Droplet, Zap, Utensils, Pizza, 
  Coffee, ShoppingCart, Car, Bike, Train, Bus, Plane, Fuel, ParkingCircle, 
  ShoppingBag, Shirt, Watch, Gift, Heart, Dumbbell, Pill, Stethoscope, Activity, 
  Smartphone, Laptop, Monitor, Printer, Camera, Music, Headphones, Tv, Film, 
  Gamepad2, Book, GraduationCap, MapPin, Baby, PawPrint, Scissors, Palette, 
  Wrench, Hammer, Lightbulb, Globe 
} from 'lucide-react';

export interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  title: string;
  description: string;
  tag: string;
  date: string;
  account: string;
}

export interface ThemeColors {
  name: string;
  primary: string;
  secondary: string;
  accent1: string;
  accent2: string;
  neutral: string;
  buttonColor?: string;
}

export interface CategoryConfig {
  icon: any; 
  color: string;
}

export const availableIcons = [
  { name: 'Wallet', component: Wallet, label: 'Finance' },
  { name: 'DollarSign', component: DollarSign, label: 'Money' },
  { name: 'Briefcase', component: Briefcase, label: 'Work' },
  { name: 'Home', component: Home, label: 'Home' },
  { name: 'Hotel', component: Hotel, label: 'Hotel' },
  { name: 'Droplet', component: Droplet, label: 'Water' },
  { name: 'Zap', component: Zap, label: 'Electricity' },
  { name: 'Utensils', component: Utensils, label: 'Dining' },
  { name: 'Pizza', component: Pizza, label: 'Fast Food' },
  { name: 'Coffee', component: Coffee, label: 'Coffee' },
  { name: 'ShoppingCart', component: ShoppingCart, label: 'Groceries' },
  { name: 'Car', component: Car, label: 'Car' },
  { name: 'Bike', component: Bike, label: 'Bike' },
  { name: 'Train', component: Train, label: 'Train' },
  { name: 'Bus', component: Bus, label: 'Bus' },
  { name: 'Plane', component: Plane, label: 'Flight' },
  { name: 'Fuel', component: Fuel, label: 'Fuel' },
  { name: 'ParkingCircle', component: ParkingCircle, label: 'Parking' },
  { name: 'ShoppingBag', component: ShoppingBag, label: 'Shopping' },
  { name: 'Shirt', component: Shirt, label: 'Clothing' },
  { name: 'Watch', component: Watch, label: 'Accessories' },
  { name: 'Gift', component: Gift, label: 'Gifts' },
  { name: 'Heart', component: Heart, label: 'Health' },
  { name: 'Dumbbell', component: Dumbbell, label: 'Fitness' },
  { name: 'Pill', component: Pill, label: 'Medicine' },
  { name: 'Stethoscope', component: Stethoscope, label: 'Medical' },
  { name: 'Activity', component: Activity, label: 'Activity' },
  { name: 'Smartphone', component: Smartphone, label: 'Phone' },
  { name: 'Laptop', component: Laptop, label: 'Computer' },
  { name: 'Monitor', component: Monitor, label: 'Electronics' },
  { name: 'Printer', component: Printer, label: 'Office' },
  { name: 'Camera', component: Camera, label: 'Photography' },
  { name: 'Music', component: Music, label: 'Music' },
  { name: 'Headphones', component: Headphones, label: 'Audio' },
  { name: 'Tv', component: Tv, label: 'TV' },
  { name: 'Film', component: Film, label: 'Movies' },
  { name: 'Gamepad2', component: Gamepad2, label: 'Gaming' },
  { name: 'Book', component: Book, label: 'Books' },
  { name: 'GraduationCap', component: GraduationCap, label: 'Education' },
  { name: 'MapPin', component: MapPin, label: 'Travel' },
  { name: 'Baby', component: Baby, label: 'Kids' },
  { name: 'PawPrint', component: PawPrint, label: 'Pets' },
  { name: 'Scissors', component: Scissors, label: 'Grooming' },
  { name: 'Palette', component: Palette, label: 'Art' },
  { name: 'Wrench', component: Wrench, label: 'Tools' },
  { name: 'Hammer', component: Hammer, label: 'Repair' },
  { name: 'Lightbulb', component: Lightbulb, label: 'Utilities' },
  { name: 'Globe', component: Globe, label: 'Internet' },
];

export const defaultThemes: ThemeColors[] = [
  { name: 'Ocean', primary: '#409BD8', secondary: '#E6642A', accent1: '#8BC3E5', accent2: '#0201D2', neutral: '#F6F1E4', buttonColor: '#1F2937' },
  { name: 'Forest', primary: '#5B9279', secondary: '#D4A574', accent1: '#A8C5A8', accent2: '#2C5F4F', neutral: '#F5F1E8', buttonColor: '#2C5F4F' },
  { name: 'Sunset', primary: '#FF6B6B', secondary: '#FFB84D', accent1: '#FFA07A', accent2: '#E63946', neutral: '#FFF5E1', buttonColor: '#E63946' },
  { name: 'Lavender', primary: '#9B8FC9', secondary: '#E89AAF', accent1: '#C5B9D5', accent2: '#6B5B95', neutral: '#F8F5FA', buttonColor: '#6B5B95' },
  { name: 'Minimal', primary: '#2C3E50', secondary: '#E74C3C', accent1: '#7F8C8D', accent2: '#34495E', neutral: '#ECF0F1', buttonColor: '#2C3E50' },
];

export const recommendedColors = [
  '#E6642A', '#409BD8', '#8BC3E5', '#0201D2', '#F6F1E4',
  '#5B9279', '#D4A574', '#A8C5A8', '#2C5F4F', '#F5F1E8',
  '#FF6B6B', '#FFB84D', '#FFA07A', '#E63946', '#FFF5E1',
  '#9B8FC9', '#E89AAF', '#C5B9D5', '#6B5B95', '#F8F5FA',
  '#2C3E50', '#E74C3C', '#7F8C8D', '#34495E', '#ECF0F1',
];

export const defaultCategories: Record<string, CategoryConfig> = {
  'Salary': { icon: Briefcase, color: '#409BD8' },
  'Rent': { icon: Home, color: '#8BC3E5' },
  'Food': { icon: Utensils, color: '#E6642A' },
  'Transport': { icon: Car, color: '#409BD8' },
  'Shopping': { icon: ShoppingBag, color: '#E6642A' },
  'Entertainment': { icon: Coffee, color: '#8BC3E5' },
  'Gift': { icon: Gift, color: '#E6642A' },
  'Health': { icon: Heart, color: '#E6642A' },
  'Communication': { icon: Smartphone, color: '#409BD8' },
  'Travel': { icon: Plane, color: '#8BC3E5' },
  'Other': { icon: DollarSign, color: '#0201D2' },
};