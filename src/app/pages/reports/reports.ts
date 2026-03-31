import { CommonModule } from '@angular/common';
import { Component, AfterViewInit } from '@angular/core';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-reports',
  imports: [CommonModule],
  templateUrl: './reports.html',
  styleUrl: './reports.scss',
})
export class Reports implements AfterViewInit {
  private dashboardChart: Chart | null = null;
  ngOnInit(): void {
    // Initial data loading can be done here if needed
  }     
  
  ngAfterViewInit(): void {
    // Called after the component's view has been fully initialized
    // You can call this.createChart(stats) here if needed
  }

  createChart(stats: any): void {
  console.log('Chart function called');

  const canvas = document.getElementById('dashboardChart') as HTMLCanvasElement;

  console.log('Canvas:', canvas);

  if (!canvas) {
    console.error('❌ Canvas NOT found');
    return;
  }

  console.log('✅ Canvas found, creating chart');

  if (this.dashboardChart) {
    this.dashboardChart.destroy();
  }

  this.dashboardChart = new Chart(canvas, {
    type: 'bar',
    data: {
      labels: ['Customers', 'Leads', 'Sales', 'Services', 'Stock'],
      datasets: [
        {
          label: 'Overview',
          data: [
            stats.totalCustomers,
            stats.activeLeads,
            stats.bikesSoldThisMonth,
            stats.serviceBookings,
            stats.stockAvailable
          ]
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false
    }
  });
}

}