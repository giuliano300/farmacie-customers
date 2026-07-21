import { Component, DestroyRef } from '@angular/core';
import { DatePipe, NgClass } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { FeathericonsModule } from '../../icons/feathericons/feathericons.module';
import { ToggleService } from './toggle.service';
import { SessionService } from '../../services/session.service';
import { customers } from '../../interfaces/customer';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
    selector: 'app-header',
    imports: [FeathericonsModule, MatButtonModule, MatMenuModule, NgClass],
    templateUrl: './header.component.html',
    styleUrl: './header.component.scss',
    providers: [
        DatePipe
    ]
})
export class HeaderComponent {

    user: customers | null = null;
    
    constructor(
        public toggleService: ToggleService,
        private datePipe: DatePipe,
        private sessionService: SessionService,
        private destroyRef: DestroyRef
    ) {
        this.toggleService.isToggled$.subscribe(isToggled => {
            this.isToggled = isToggled;
        });
        this.formattedDate = this.datePipe.transform(this.currentDate, 'dd MMMM yyyy');

        this.sessionService.userSubject
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(user => this.user = user);
    }
    
    // Toggle Service
    isToggled = false;
    toggle() {
        this.toggleService.toggle();
    }

    // Dark Mode
    toggleTheme() {
        this.toggleService.toggleTheme();
    }

    // Current Date
    currentDate: Date = new Date();
    formattedDate: any;

}
