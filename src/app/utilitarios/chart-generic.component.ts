
import { Component, Input, OnChanges, ViewChild } from '@angular/core';
import { ChartConfiguration, ChartEvent, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { Paises } from '../models/paises';
import { Dataset } from '../models/dataset';
import { MatDrawer } from '@angular/material/sidenav';

@Component({
  selector: 'app-chart-generic',
  templateUrl: './chart-generic.component.html',
  styleUrl: './chart-generic.component.scss'
})
export class ChartGenericComponent implements OnChanges {
  @Input() inputPaises: Paises[] = [];
  random_rgba(r: any) {
    const o = Math.round, s = 255;
    return 'rgba(' + o(r() * s) + ',' + o(r() * s) + ',' + o(r() * s) + ',' + r().toFixed(1) + ')';
  }


  ngOnChanges(): void {
    if (this.inputPaises.length > 0) {
      let usuarios: string[] = [];

      this.inputPaises.forEach(el => {
        usuarios.push(el.usuario);
      })
      usuarios = usuarios.filter((value, index) => usuarios.indexOf(value) === index);

      let numbers: number[] = [];
      let dataset: Dataset = new Dataset();
      usuarios.forEach((element) => {
        // indice++;
        const paisesUser = this.inputPaises.filter(el => { return el.usuario === element });
        paisesUser.forEach(paisUser => {
          numbers.push(Number(paisUser.poblacion));
        });
        const r = Math.random;
        dataset.backgroundColor = this.random_rgba(r);
        dataset.borderColor = this.random_rgba(r)
        dataset.pointBackgroundColor = this.random_rgba(r);
        dataset.pointBorderColor = '#fff';
        dataset.pointHoverBackgroundColor = '#fff';
        dataset.pointHoverBorderColor = this.random_rgba(r);
        dataset.fill = 'origin';
        dataset.label = "Paises de " + element
        dataset.data = [];
        dataset.data.push(...numbers);
        this.lineChartData.datasets.push(dataset);
        numbers = [];
        dataset = new Dataset();

      });
      this.chart?.update();
    }

  }


  lineChartData: ChartConfiguration['data'] = {

    datasets: [],
    labels: ['Enero', 'Febrero', 'Marzo'],
  };

  public lineChartOptions: ChartConfiguration['options'] = {
    elements: {
      line: {
        tension: 0.5,
      },
    },
    scales: {
      y: {
        position: 'left',
      },
      y1: {
        position: 'right',
        grid: {
          color: 'rgba(255,0,0,0.3)',
        },
        ticks: {
          color: 'red',
        },
      },
    },

    plugins: {
      legend: { display: true }
    },
  };

  public lineChartType: ChartType = 'line';

  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

  public chartClicked({
    event,
    active,
  }: {
    event?: ChartEvent;
    active?: object[];
  }): void {
    console.log(event, active);
  }

  public chartHovered({
    event,
    active,
  }: {
    event?: ChartEvent;
    active?: object[];
  }): void {
    console.log(event, active);
  }
}
