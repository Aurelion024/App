import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { IonicModule } from '@ionic/angular';

import { SolicitarViajePageRoutingModule } from './solicitar-viaje-routing.module';

import { SolicitarViajePage } from './solicitar-viaje.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SolicitarViajePageRoutingModule,
    HttpClientModule
  ],
  declarations: [SolicitarViajePage]
  
})
export class SolicitarViajePageModule {}
