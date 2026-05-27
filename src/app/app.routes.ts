import { Routes } from '@angular/router';
import { NotFoundComponent } from './common/not-found/not-found.component';
import { SignInComponent } from './authentication/sign-in/sign-in.component';
import { AuthenticationComponent } from './authentication/authentication.component';
import { HomeComponent } from './pages/home/home.component';
import { ProducersComponent } from './pages/customers/producer/producers.component';
import { CategoriesComponent } from './pages/customers/categories/categories.component';
import { HistoryComponent } from './pages/customers/history/history.component';
import { FarmadatiComponent } from './pages/farmadati/farmadati.component';
import { ProductToExcludeComponent } from './pages/customers/product-to-exclude/product-to-exclude.component';

export const routes: Routes = [
    { path: '', redirectTo : '/authentication', pathMatch: 'full' },
    {
        path: 'authentication',
        component: AuthenticationComponent,
        children: [
            {path: '', component: SignInComponent}
        ]
    },
    {path: 'home', component: HomeComponent},
    {path: 'farmadati', component: FarmadatiComponent},
    {path: 'customer/products-to-exclude', component: ProductToExcludeComponent},
    {path: 'customer/categories', component: CategoriesComponent},
    {path: 'customer/producers', component: ProducersComponent},
    {path: 'customer/history', component: HistoryComponent},
    { path: '**', component:NotFoundComponent}
];
