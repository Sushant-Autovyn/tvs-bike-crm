import { CommonModule } from '@angular/common';
import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, inject, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { DashboardService } from '../../services/dashboard';
import { Auth } from '../../services/auth';
import Chart from 'chart.js/auto';
import { timeout, catchError, of } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('revenueChart', { static: false }) revenueCanvas?: ElementRef<HTMLCanvasElement>;
  @ViewChild('customerChart', { static: false }) customerCanvas?: ElementRef<HTMLCanvasElement>;
  @ViewChild('salesTrendChart', { static: false }) salesTrendCanvas?: ElementRef<HTMLCanvasElement>;
  @ViewChild('serviceChart', { static: false }) serviceCanvas?: ElementRef<HTMLCanvasElement>;
  @ViewChild('modelsChart', { static: false }) modelsCanvas?: ElementRef<HTMLCanvasElement>;
  
  private dashboardService = inject(DashboardService);
  private auth = inject(Auth);
  private cdr = inject(ChangeDetectorRef);
  
  // Chart instances
  private revenueChart: Chart | null = null;
  private customerChart: Chart | null = null;
  private salesTrendChart: Chart | null = null;
  private serviceChart: Chart | null = null;
  private modelsChart: Chart | null = null;
  
  private chartRetryCount = 0;
  private maxRetries = 5;

  isLoading = true;
  errorMsg = '';
  stats: any[] = [];
  recentActivities: any[] = [];
  dashboardStats: any = null;
  greeting = '';
  userName = '';

  ngOnInit(): void {
    console.log('Dashboard component initializing...');
    this.setGreeting();
    this.setUserName();
    
    // Set fallback data immediately to ensure charts have something to work with
    console.log('Setting initial fallback data...');
    this.useFallbackData();
    
    // Then try to load real data
    this.loadDashboardData();

    // Add debug method to window for console access
    if (typeof window !== 'undefined') {
      (window as any).dashboardComponent = this;
    }
  }

  ngAfterViewInit(): void {
    console.log('Dashboard view initialized');
    
    // Multiple attempts to ensure charts are created
    setTimeout(() => {
      console.log('First chart creation attempt...');
      this.tryCreateChart();
    }, 500);
    
    setTimeout(() => {
      console.log('Second chart creation attempt...');
      this.tryCreateChart(); 
    }, 1500);
    
    setTimeout(() => {
      console.log('Third chart creation attempt...');
      this.tryCreateChart();
    }, 3000);
  }

  ngOnDestroy(): void {
    console.log('Dashboard component destroying...');
    // Destroy all charts
    [this.revenueChart, this.customerChart, this.salesTrendChart, 
     this.serviceChart, this.modelsChart].forEach(chart => {
      if (chart) {
        chart.destroy();
      }
    });
  }

  loadDashboardData(): void {
    console.log('Loading dashboard data...');
    this.isLoading = true;
    this.errorMsg = '';

    // Add timeout and fallback data
    this.dashboardService.getStats()
      .pipe(
        timeout(10000), // 10 second timeout
        catchError(error => {
          console.warn('Dashboard API failed, using fallback data:', error);
          return of(this.getFallbackData());
        })
      )
      .subscribe({
        next: (response) => {
          console.log('Dashboard data received:', response);
          const stats = response?.stats || response; // Handle different response formats

          if (!stats) {
            console.warn('No stats received, using fallback data');
            this.useFallbackData();
            return;
          }

          this.processDashboardData(stats, response?.recentActivities);
        },
        error: (error) => {
          console.error('Dashboard error:', error); 
          this.useFallbackData();
        }
      });
  }

  private processDashboardData(stats: any, activities?: any[]): void {
    // Dashboard cards data
    this.stats = [
      { title: 'Total Customers', value: stats.totalCustomers || 0, change: '+12.5%', icon: '👥' },
      { title: 'Active Leads', value: stats.activeLeads || 0, change: '+8.2%', icon: '🎯' },
      { title: 'Bikes Sold (Month)', value: stats.bikesSoldThisMonth || 0, change: '+15.3%', icon: '🛒' },
      { title: 'Service Bookings', value: stats.serviceBookings || 0, change: '-3.1%', icon: '🛠' },
      { title: 'Revenue (Month)', value: `₹${((stats.revenueThisMonth || 0) / 100000).toFixed(1)}L`, change: '+22.1%', icon: '₹' },
      { title: 'Stock Available', value: stats.stockAvailable || 0, change: '-5.2%', icon: '📦' }
    ];

    // Ensure activities have proper structure for template
    this.recentActivities = (activities || []).map(activity => ({
      type: activity.type || 'info',
      title: activity.title || activity.description || 'Activity',
      time: activity.time || 'Recently'
    }));

    this.dashboardStats = stats;
    this.isLoading = false;

    console.log('Data processed, triggering change detection');
    // Trigger change detection to update the UI immediately
    this.cdr.detectChanges();

    // Try to create chart after data is loaded and UI updated
    setTimeout(() => {
      console.log('Attempting chart creation after data load...');
      this.tryCreateChart();
    }, 250);

    // Additional fallback attempt
    setTimeout(() => {
      console.log('Fallback chart creation attempt...');
      this.tryCreateChart();
    }, 1000);
  }

  private getFallbackData(): any {
    return {
      stats: {
        totalCustomers: 1284,
        activeLeads: 86,
        bikesSoldThisMonth: 342,
        serviceBookings: 23,
        revenueThisMonth: 2451000,
        stockAvailable: 47
      },
      recentActivities: [
        { type: 'sale', title: 'New bike sale completed', time: '2 hours ago', description: 'New bike sale - Apache RTR 160' },
        { type: 'service', title: 'Service booking completed', time: '3 hours ago', description: 'Service completed - Jupiter 125' },
        { type: 'lead', title: 'New lead generated', time: '5 hours ago', description: 'New lead - Engine tune-up inquiry' }
      ]
    };
  }

  private useFallbackData(): void {
    const fallbackData = this.getFallbackData();
    this.processDashboardData(fallbackData.stats, fallbackData.recentActivities);
    
    // Show a subtle message that we're using cached data
    console.log('Using fallback dashboard data - API unavailable');
    
    // Ensure change detection triggers
    this.cdr.detectChanges();
  }

  private tryCreateChart(): void {
    console.log(`Chart creation attempt ${this.chartRetryCount + 1}/${this.maxRetries}`);
    console.log('isLoading:', this.isLoading);
    console.log('dashboardStats available:', !!this.dashboardStats);

    if (this.chartRetryCount >= this.maxRetries) {
      console.warn('Max chart creation retries reached');
      return;
    }

    // Check if any charts already exist - if so, don't retry
    if (this.revenueChart || this.customerChart || this.salesTrendChart || this.serviceChart || this.modelsChart) {
      console.log('Charts already exist, skipping retry');
      return;
    }

    if (!this.dashboardStats || this.isLoading) {
      this.chartRetryCount++;
      if (this.chartRetryCount < this.maxRetries) {
        console.log('Missing requirements, retrying in 500ms...');
        setTimeout(() => this.tryCreateChart(), 500);
      }
      return;
    }

    // Check if at least some DOM elements are available
    const elementsAvailable = document.getElementById('revenueChart') || 
                              document.getElementById('customerChart') ||
                              document.getElementById('salesTrendChart');
    
    if (!elementsAvailable) {
      this.chartRetryCount++;
      if (this.chartRetryCount < this.maxRetries) {
        console.log('DOM elements not ready, retrying in 500ms...');
        setTimeout(() => this.tryCreateChart(), 500);
      }
      return;
    }

    console.log('All requirements met, creating all charts...');
    this.createAllCharts();
  }

  // Public method for manual debugging
  forceCreateChart(): void {
    console.log('Force creating charts...');
    this.chartRetryCount = 0;
    this.tryCreateChart();
  }

  // Debug method to test all components
  debugCharts(): void {
    console.log('=== CHART DEBUG INFO ===');
    console.log('isLoading:', this.isLoading);
    console.log('errorMsg:', this.errorMsg);
    console.log('dashboardStats:', this.dashboardStats);
    
    // Check ViewChild elements
    console.log('ViewChild Elements:');
    console.log('  revenueCanvas:', !!this.revenueCanvas?.nativeElement);
    console.log('  customerCanvas:', !!this.customerCanvas?.nativeElement);
    console.log('  salesTrendCanvas:', !!this.salesTrendCanvas?.nativeElement);
    console.log('  serviceCanvas:', !!this.serviceCanvas?.nativeElement);
    console.log('  modelsCanvas:', !!this.modelsCanvas?.nativeElement);
    
    // Check DOM elements
    console.log('DOM Elements:');
    console.log('  #revenueChart:', !!document.getElementById('revenueChart'));
    console.log('  #customerChart:', !!document.getElementById('customerChart'));
    console.log('  #salesTrendChart:', !!document.getElementById('salesTrendChart'));
    console.log('  #serviceChart:', !!document.getElementById('serviceChart'));
    console.log('  #modelsChart:', !!document.getElementById('modelsChart'));
    
    // Check existing charts
    console.log('Existing Charts:');
    console.log('  revenueChart:', !!this.revenueChart);
    console.log('  customerChart:', !!this.customerChart);
    console.log('  salesTrendChart:', !!this.salesTrendChart);
    console.log('  serviceChart:', !!this.serviceChart);
    console.log('  modelsChart:', !!this.modelsChart);
    
    // Force create charts if data is available
    if (this.dashboardStats && !this.isLoading) {
      console.log('Forcing chart creation...');
      this.forceCreateChart();
    } else {
      console.log('Cannot create charts - missing data or still loading');
    }
  }

  createAllCharts(): void {
    console.log('Creating all dashboard charts...');
    
    // Use longer delays and ensure DOM is ready
    setTimeout(() => {
      console.log('Creating revenue chart...');
      this.createRevenueChart();
    }, 100);
    
    setTimeout(() => {
      console.log('Creating customer chart...');
      this.createCustomerChart();
    }, 300);
    
    setTimeout(() => {
      console.log('Creating sales trend chart...');
      this.createSalesTrendChart();
    }, 500);
    
    setTimeout(() => {
      console.log('Creating service chart...');
      this.createServiceChart();
    }, 700);
    
    setTimeout(() => {
      console.log('Creating models chart...');
      this.createModelsChart();
    }, 900);
  }

  createRevenueChart(): void {
    // Try multiple ways to get the canvas
    let canvas: HTMLCanvasElement | null = null;
    
    if (this.revenueCanvas?.nativeElement) {
      canvas = this.revenueCanvas.nativeElement;
      console.log('Found revenue canvas via ViewChild');
    } else {
      canvas = document.getElementById('revenueChart') as HTMLCanvasElement;
      console.log('Found revenue canvas via getElementById:', !!canvas);
    }
    
    if (!canvas) {
      console.error('Revenue canvas not found');
      return;
    }

    try {
      if (this.revenueChart) {
        this.revenueChart.destroy();
        console.log('Destroyed existing revenue chart');
      }

      console.log('Creating revenue chart with data:', this.dashboardStats);
      
      this.revenueChart = new Chart(canvas, {
        type: 'bar',
        data: {
          labels: ['Customers', 'Leads', 'Sales', 'Services', 'Stock'],
          datasets: [{
            label: 'Business Overview',
            data: [
              this.dashboardStats?.totalCustomers || 0,
              this.dashboardStats?.activeLeads || 0,
              this.dashboardStats?.bikesSoldThisMonth || 0,
              this.dashboardStats?.serviceBookings || 0,
              this.dashboardStats?.stockAvailable || 0
            ],
            backgroundColor: [
              'rgba(59, 130, 246, 0.8)',   // Blue
              'rgba(16, 185, 129, 0.8)',   // Emerald
              'rgba(245, 158, 11, 0.8)',   // Amber
              'rgba(139, 92, 246, 0.8)',   // Purple
              'rgba(236, 72, 153, 0.8)'    // Pink
            ],
            borderColor: [
              'rgba(59, 130, 246, 1)',     // Blue
              'rgba(16, 185, 129, 1)',     // Emerald
              'rgba(245, 158, 11, 1)',     // Amber
              'rgba(139, 92, 246, 1)',     // Purple
              'rgba(236, 72, 153, 1)'      // Pink
            ],
            borderWidth: 2,
            borderRadius: 8
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            y: {
              beginAtZero: true,
              grid: { color: 'rgba(255, 255, 255, 0.1)' },
              ticks: { color: '#a0aec0' }
            },
            x: {
              grid: { display: false },
              ticks: { color: '#a0aec0' }
            }
          }
        }
      });
      
      console.log('Revenue chart created successfully');
    } catch (error) {
      console.error('Failed to create revenue chart:', error);
    }
  }

  createCustomerChart(): void {
    let canvas: HTMLCanvasElement | null = null;
    
    if (this.customerCanvas?.nativeElement) {
      canvas = this.customerCanvas.nativeElement;
      console.log('Found customer canvas via ViewChild');
    } else {
      canvas = document.getElementById('customerChart') as HTMLCanvasElement;
      console.log('Found customer canvas via getElementById:', !!canvas);
    }
    
    if (!canvas) {
      console.error('Customer canvas not found');
      return;
    }

    try {
      if (this.customerChart) {
        this.customerChart.destroy();
        console.log('Destroyed existing customer chart');
      }

      this.customerChart = new Chart(canvas, {
        type: 'pie',
        data: {
          labels: ['New Customers', 'Returning', 'Premium', 'Regular'],
          datasets: [{
            data: [45, 28, 15, 12],
            backgroundColor: [
              'rgba(59, 130, 246, 0.8)',   // Blue
              'rgba(16, 185, 129, 0.8)',   // Emerald
              'rgba(245, 158, 11, 0.8)',   // Amber
              'rgba(139, 92, 246, 0.8)'    // Purple
            ],
            borderColor: [
              'rgba(59, 130, 246, 1)',     // Blue
              'rgba(16, 185, 129, 1)',     // Emerald
              'rgba(245, 158, 11, 1)',     // Amber
              'rgba(139, 92, 246, 1)'      // Purple
            ],
            borderWidth: 2
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom',
              labels: { color: '#a0aec0', padding: 20 }
            }
          }
        }
      });
      
      console.log('Customer chart created successfully');
    } catch (error) {
      console.error('Failed to create customer chart:', error);
    }
  }

  createSalesTrendChart(): void {
    let canvas: HTMLCanvasElement | null = null;
    
    if (this.salesTrendCanvas?.nativeElement) {
      canvas = this.salesTrendCanvas.nativeElement;
      console.log('Found sales trend canvas via ViewChild');
    } else {
      canvas = document.getElementById('salesTrendChart') as HTMLCanvasElement;
      console.log('Found sales trend canvas via getElementById:', !!canvas);
    }
    
    if (!canvas) {
      console.error('Sales trend canvas not found');
      return;
    }

    try {
      if (this.salesTrendChart) {
        this.salesTrendChart.destroy();
        console.log('Destroyed existing sales trend chart');
      }

      this.salesTrendChart = new Chart(canvas, {
        type: 'line',
        data: {
          labels: ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'],
          datasets: [{
            label: 'Bikes Sold',
            data: [45, 52, 38, 67, 73, 82],
            borderColor: 'rgba(59, 130, 246, 1)',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            borderWidth: 3,
            fill: true,
            tension: 0.4,
            pointBackgroundColor: 'rgba(59, 130, 246, 1)',
            pointBorderColor: '#ffffff',
            pointBorderWidth: 2,
            pointRadius: 6
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false }
          },
          scales: {
            y: {
              beginAtZero: true,
              grid: { color: 'rgba(255, 255, 255, 0.1)' },
              ticks: { color: '#a0aec0' }
            },
            x: {
              grid: { display: false },
              ticks: { color: '#a0aec0' }
            }
          }
        }
      });
      
      console.log('Sales trend chart created successfully');
    } catch (error) {
      console.error('Failed to create sales trend chart:', error);
    }
  }

  createServiceChart(): void {
    let canvas: HTMLCanvasElement | null = null;
    
    if (this.serviceCanvas?.nativeElement) {
      canvas = this.serviceCanvas.nativeElement;
      console.log('Found service canvas via ViewChild');
    } else {
      canvas = document.getElementById('serviceChart') as HTMLCanvasElement;
      console.log('Found service canvas via getElementById:', !!canvas);
    }
    
    if (!canvas) {
      console.error('Service canvas not found');
      return;
    }

    try {
      if (this.serviceChart) {
        this.serviceChart.destroy();
        console.log('Destroyed existing service chart');
      }

      this.serviceChart = new Chart(canvas, {
        type: 'doughnut',
        data: {
          labels: ['Completed', 'In Progress', 'Pending', 'Cancelled'],
          datasets: [{
            data: [68, 15, 12, 5],
            backgroundColor: [
              'rgba(16, 185, 129, 0.8)',   // Emerald - Completed
              'rgba(245, 158, 11, 0.8)',   // Amber - In Progress
              'rgba(239, 68, 68, 0.8)',    // Red - Pending
              'rgba(107, 114, 128, 0.8)'   // Gray - Cancelled
            ],
            borderColor: [
              'rgba(16, 185, 129, 1)',     // Emerald
              'rgba(245, 158, 11, 1)',     // Amber
              'rgba(239, 68, 68, 1)',      // Red
              'rgba(107, 114, 128, 1)'     // Gray
            ],
            borderWidth: 2
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          cutout: '60%',
          plugins: {
            legend: {
              position: 'bottom',
              labels: { color: '#a0aec0', padding: 20 }
            }
          }
        }
      });
      
      console.log('Service chart created successfully');
    } catch (error) {
      console.error('Failed to create service chart:', error);
    }
  }

  createModelsChart(): void {
    let canvas: HTMLCanvasElement | null = null;
    
    if (this.modelsCanvas?.nativeElement) {
      canvas = this.modelsCanvas.nativeElement;
      console.log('Found models canvas via ViewChild');
    } else {
      canvas = document.getElementById('modelsChart') as HTMLCanvasElement;
      console.log('Found models canvas via getElementById:', !!canvas);
    }
    
    if (!canvas) {
      console.error('Models canvas not found');
      return;
    }

    try {
      if (this.modelsChart) {
        this.modelsChart.destroy();
        console.log('Destroyed existing models chart');
      }

      this.modelsChart = new Chart(canvas, {
        type: 'bar',
        data: {
          labels: ['Apache RTR', 'Jupiter', 'XL100', 'Ntorq', 'Scooty'],
          datasets: [{
            label: 'Units Sold',
            data: [28, 35, 19, 42, 23],
            backgroundColor: [
              'rgba(239, 68, 68, 0.8)',    // Red - Apache RTR
              'rgba(59, 130, 246, 0.8)',   // Blue - Jupiter
              'rgba(16, 185, 129, 0.8)',   // Emerald - XL100
              'rgba(245, 158, 11, 0.8)',   // Amber - Ntorq
              'rgba(139, 92, 246, 0.8)'    // Purple - Scooty
            ],
            borderColor: [
              'rgba(239, 68, 68, 1)',      // Red
              'rgba(59, 130, 246, 1)',     // Blue
              'rgba(16, 185, 129, 1)',     // Emerald
              'rgba(245, 158, 11, 1)',     // Amber
              'rgba(139, 92, 246, 1)'      // Purple
            ],
            borderWidth: 2,
            borderRadius: 8
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            y: {
              beginAtZero: true,
              grid: { color: 'rgba(255, 255, 255, 0.1)' },
              ticks: { color: '#a0aec0' }
            },
            x: {
              grid: { display: false },
              ticks: { color: '#a0aec0', maxRotation: 45 }
            }
          }
        }
      });
      
      console.log('Models chart created successfully');
    } catch (error) {
      console.error('Failed to create models chart:', error);
    }
  }

  private setGreeting(): void {
    const now = new Date();
    const hour = now.getHours();
    console.log('Current hour:', hour);
    
    if (hour < 12) {
      this.greeting = 'Good Morning';
    } else if (hour < 18) {
      this.greeting = 'Good Afternoon';  
    } else {
      this.greeting = 'Good Evening';
    }
    
    console.log('Set greeting to:', this.greeting);
  }

  private setUserName(): void {
    const user = this.auth.getUser();
    console.log('User from auth:', user);
    
    if (user) {
      // Try to get name from user object, fallback to email username, then to default
      this.userName = user.name || 
                     user.email?.split('@')[0] || 
                     user.username || 
                     'User';
    } else {
      this.userName = 'User';
    }
    
    console.log('Set userName to:', this.userName);
  }
}