import { Component, AfterViewInit, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { forkJoin } from 'rxjs';
import { CategoryService } from '../../../modules/inventory/services/category.service';
import { OrderService } from '../../../modules/inventory/services/order.service';
import { ProductService } from '../../../modules/inventory/services/product.service';
import { PromotionService } from '../../../modules/inventory/services/promotion.service';
import { SupplierService } from '../../../modules/inventory/services/supplier.service';

interface Transaction {
  id: string;
  type: 'income' | 'expense';
  description: string;
  client: string;
  amount: number;
  date: Date;
  status: 'completed' | 'pending';
  icon: string;
  iconBg: string;
}

interface Activity {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  icon: string;
  iconBg: string;
  amount?: number;
  badge?: string;
  badgeColor?: string;
}

interface MonthlyData {
  month: string;
  amount: number;
  percentage: number;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit, AfterViewInit {
  private readonly productService = inject(ProductService);
  private readonly categoryService = inject(CategoryService);
  private readonly supplierService = inject(SupplierService);
  private readonly promotionService = inject(PromotionService);
  private readonly orderService = inject(OrderService);

  inventoryLoading = true;
  inventoryError = false;
  inventoryTotalProducts = 0;
  inventoryCategories = 0;
  inventorySuppliers = 0;
  inventoryLowStock = 0;
  inventoryOutOfStock = 0;
  inventoryActivePromotions = 0;
  inventoryPendingOrders = 0;
  inventoryValue = 0;

  // Datos del balance principal
  totalBalance = 25000000;
  monthlyIncome = 40000000;
  monthlyExpenses = 15000000;
  profitMargin = 62.5;
  balanceChange = 4580000;

  // Estadísticas rápidas
  totalSales = 248;
  salesGrowth = 23;
  activeClients = 48;
  newClients = 8;

  // Datos mensuales para gráfico
  monthlyData: MonthlyData[] = [
    { month: 'Julio', amount: 35000000, percentage: 64 },
    { month: 'Agosto', amount: 38000000, percentage: 69 },
    { month: 'Septiembre', amount: 42000000, percentage: 76 },
    { month: 'Octubre', amount: 36000000, percentage: 65 },
    { month: 'Noviembre', amount: 45000000, percentage: 82 },
    { month: 'Diciembre', amount: 40000000, percentage: 73 },
  ];

  // Actividades recientes
  recentActivities: Activity[] = [
    {
      id: '1',
      title: 'Factura #2026-045 procesada',
      description: 'Cliente: Corporación Empresarial XYZ',
      timestamp: 'Hace 25 minutos',
      icon: 'check',
      iconBg: 'bg-emerald-100',
      amount: 5000000,
    },
    {
      id: '2',
      title: 'Nuevo cliente registrado',
      description: 'Comercial Los Ángeles S.A.',
      timestamp: 'Hace 2 horas',
      icon: 'user-plus',
      iconBg: 'bg-blue-100',
      badge: 'Nuevo',
      badgeColor: 'bg-blue-50 text-blue-700',
    },
    {
      id: '3',
      title: 'Pago pendiente de confirmar',
      description: 'Orden #ORD-8874 - Materiales Constructora',
      timestamp: 'Hace 5 horas',
      icon: 'alert-circle',
      iconBg: 'bg-orange-100',
      amount: 2500000,
    },
    {
      id: '4',
      title: 'Reporte mensual generado',
      description: 'Informe financiero de diciembre 2025',
      timestamp: 'Hace 1 día',
      icon: 'file-text',
      iconBg: 'bg-purple-100',
    },
  ];

  // Transacciones recientes
  recentTransactions: Transaction[] = [
    {
      id: '1',
      type: 'income',
      description: 'Pago de cliente - Factura #2026-045',
      client: 'Corporación Empresarial XYZ',
      amount: 5000000,
      date: new Date('2026-01-04T09:15:00'),
      status: 'completed',
      icon: 'arrow-down-left',
      iconBg: 'bg-emerald-100',
    },
    {
      id: '2',
      type: 'expense',
      description: 'Compra de inventario',
      client: 'Proveedor Nacional Ltda.',
      amount: 2500000,
      date: new Date('2026-01-03T14:30:00'),
      status: 'completed',
      icon: 'arrow-up-right',
      iconBg: 'bg-rose-100',
    },
    {
      id: '3',
      type: 'expense',
      description: 'Servicios públicos - Diciembre',
      client: 'ICE, AyA, Municipalidad',
      amount: 1200000,
      date: new Date('2026-01-02T11:00:00'),
      status: 'pending',
      icon: 'arrow-up-right',
      iconBg: 'bg-amber-100',
    },
    {
      id: '4',
      type: 'income',
      description: 'Consultoría especializada',
      client: 'Comercial Los Ángeles S.A.',
      amount: 3200000,
      date: new Date('2025-12-30T16:45:00'),
      status: 'completed',
      icon: 'arrow-down-left',
      iconBg: 'bg-emerald-100',
    },
    {
      id: '5',
      type: 'expense',
      description: 'Nómina quincenal',
      client: 'Personal administrativo y operativo',
      amount: 8500000,
      date: new Date('2025-12-28T08:00:00'),
      status: 'completed',
      icon: 'arrow-up-right',
      iconBg: 'bg-rose-100',
    },
  ];

  constructor() {}

  ngOnInit(): void {
    this.loadInventorySummary();
    // Inicializar datos o hacer peticiones HTTP aquí
  }

  loadInventorySummary(): void {
    this.inventoryLoading = true;
    this.inventoryError = false;
    forkJoin({
      products: this.productService.getProducts(),
      categories: this.categoryService.getCategories(),
      suppliers: this.supplierService.getSuppliers(),
      promotions: this.promotionService.getPromotions(),
      orders: this.orderService.getOrders(),
    }).subscribe({
      next: (data) => {
        const now = Date.now();
        this.inventoryTotalProducts = data.products.length;
        this.inventoryCategories = data.categories.length;
        this.inventorySuppliers = data.suppliers.length;
        this.inventoryLowStock = data.products.filter(
          (product) => product.stock > 0 && product.stock <= 5,
        ).length;
        this.inventoryOutOfStock = data.products.filter((product) => product.stock === 0).length;
        this.inventoryActivePromotions = data.promotions.filter(
          (promotion) =>
            new Date(promotion.start_date).getTime() <= now &&
            new Date(promotion.end_date).getTime() >= now,
        ).length;
        this.inventoryPendingOrders = data.orders.filter(
          (order) => order.status_order === 1,
        ).length;
        this.inventoryValue = data.products.reduce(
          (total, product) => total + Number(product.sale_price) * product.stock,
          0,
        );
        this.inventoryLoading = false;
      },
      error: () => {
        this.inventoryError = true;
        this.inventoryLoading = false;
      },
    });
  }

  ngAfterViewInit(): void {
    // Initialize Feather Icons
    if ((globalThis as any).feather) {
      (globalThis as any).feather.replace();
    }

    // Aplicar animaciones a las barras de progreso
    setTimeout(() => {
      const progressBars = document.querySelectorAll('.progress-bar');
      progressBars.forEach((bar) => {
        bar.classList.add('animate-progress');
      });
    }, 100);
  }

  // Métodos helper para el template
  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('es-CR', {
      style: 'currency',
      currency: 'CRC',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  }

  formatDate(date: Date): string {
    return new Intl.DateTimeFormat('es-CR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  }

  getTransactionColor(type: 'income' | 'expense'): string {
    return type === 'income' ? 'text-emerald-600' : 'text-rose-600';
  }

  getStatusColor(status: 'completed' | 'pending'): string {
    return status === 'completed'
      ? 'bg-emerald-50 text-emerald-700'
      : 'bg-yellow-50 text-yellow-700';
  }

  getStatusText(status: 'completed' | 'pending'): string {
    return status === 'completed' ? 'Completado' : 'Pendiente';
  }
}
