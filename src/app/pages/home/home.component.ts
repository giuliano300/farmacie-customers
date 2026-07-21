import { CommonModule } from '@angular/common';
import { Component, DestroyRef } from '@angular/core';
import { Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { forkJoin, timer, switchMap } from 'rxjs';
import { DashboardService } from '../../services/dashboard.service';
import { BatchesService } from '../../services/batches.service';
import { SessionService } from '../../services/session.service';
import { BatchDashboardItem } from '../../interfaces/Dashboard';
import { CompleteBatchesItem } from '../../interfaces/CompleteBatchesItem';

@Component({
    selector: 'app-home',
    imports: [CommonModule],
    templateUrl: './home.component.html',
    styleUrl: './home.component.scss'
})
export class HomeComponent {
    activeBatches: BatchDashboardItem[] = [];
    completedBatches: CompleteBatchesItem[] = [];
    customer: any = null;
    loading = true;

    constructor(
        private dashboardService: DashboardService,
        private batchesService: BatchesService,
        private sessionService: SessionService,
        private router: Router,
        private destroyRef: DestroyRef
    ) {}

    ngOnInit(): void {
        this.customer = this.sessionService.getUser();

        timer(0, 3000).pipe(
            switchMap(() => forkJoin({
                dashboard: this.dashboardService.getDashboard(),
                completed: this.batchesService.today()
            })),
            takeUntilDestroyed(this.destroyRef)
        ).subscribe(data => {
            const customerId = this.customer?.id;
            this.activeBatches = data.dashboard.activeBatches.filter(item => !item.customerId || item.customerId === customerId);
            this.completedBatches = data.completed.filter(item => !item.batch.customerId || item.batch.customerId === customerId);
            this.loading = false;
        });
    }

    get totalProductsToday(): number {
        return this.completedBatches.reduce((total, item) => total + (item.report?.totalProducts ?? 0), 0);
    }

    get errorsToday(): number {
        return this.completedBatches.reduce((total, item) => total + (item.report?.errors ?? 0), 0) +
            this.activeBatches.reduce((total, item) => total + this.batchErrors(item), 0);
    }

    get successRate(): number {
        const reported = this.completedBatches.filter(item => item.report);
        if (!reported.length) return 100;
        return Math.round(reported.filter(item => (item.report?.errors ?? 0) === 0).length / reported.length * 100);
    }

    get averageProgress(): number {
        if (!this.activeBatches.length) return this.completedBatches.length ? 100 : 0;
        return Math.round(this.activeBatches.reduce((sum, item) => sum + this.batchProgress(item), 0) / this.activeBatches.length);
    }

    stepProgress(step: 'heronImport' | 'farmadati' | 'suppliers'): number {
        if (!this.activeBatches.length) return this.completedBatches.length ? 100 : 0;
        return Math.round(this.activeBatches.reduce((sum, item) => sum + (item[step]?.progress ?? 0), 0) / this.activeBatches.length);
    }

    get magentoProgress(): number {
        if (!this.activeBatches.length) return this.completedBatches.length ? 100 : 0;
        return Math.round(this.activeBatches.reduce((sum, item) => sum + (item.magento?.progressTotal ?? 0), 0) / this.activeBatches.length);
    }

    private batchProgress(item: BatchDashboardItem): number {
        return Math.round(((item.heronImport?.progress ?? 0) + (item.farmadati?.progress ?? 0) +
            (item.suppliers?.progress ?? 0) + (item.magento?.progressTotal ?? 0)) / 4);
    }

    private batchErrors(item: BatchDashboardItem): number {
        return (item.heronImport?.errors ?? 0) + (item.farmadati?.errors ?? 0) + (item.suppliers?.errors ?? 0) +
            (item.magento?.insertProducts?.errors ?? 0) + (item.magento?.updateProducts?.errors ?? 0) +
            (item.magento?.insertImages?.errors ?? 0);
    }

    openBatches(): void { this.router.navigate(['/batches']); }
    openHistory(): void { this.router.navigate(['/customer/history']); }
}
