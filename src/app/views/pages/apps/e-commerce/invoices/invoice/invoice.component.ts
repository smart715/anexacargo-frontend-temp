import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
@Component({
  selector: 'kt-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.scss']
})
export class InvoiceComponent implements OnInit {

  dataSource: MatTableDataSource<any>;
  dataSourcePagos: MatTableDataSource<any>;

  displayedColumns = ['description', 'discount', 'total'];

  displayedColumnsPagos = ['paymentID', 'date', 'description', 'amount'];
  image_url;

  constructor() { }

  ngOnInit(): void {
    this.image_url = window.localStorage.getItem("image_url");
    this.dataSource = new MatTableDataSource(this.description);
    this.dataSourcePagos = new MatTableDataSource(this.pagos);

  }
  packageView() {

  }
  description: any = [
    {
      id: 0,
      description: 'Servicio de entrega ID',
      discount: '',
      total: '50.00',
    },
    {
      id: 1,
      description: 'Servicio de entrega ID',
      discount: '',
      total: '50.00',
    },
    {
      id: 2,
      description: 'Servicio de entrega ID',
      discount: '',
      total: '50.00',
    },
    {
      id: 6,
      discount: 'Discount',
      description: '',
      total: '-50.00',
    },
    {
      id: 7,
      discount: 'Sub Total',
      description: '',
      total: '100.00',
    },
    {
      id: 8,
      discount: 'items',
      description: '',
      total: '7.00',
    },
    {
      id: 9,
      discount: 'Total',
      description: '',
      total: '107.00',
    }
  ]
  pagos: any = [
    {
      id: 0,
      paymentID: 123,
      date: '02/02/20 14:28pm',
      description: 'Pago de factura',
      amount: '50.00'
    },
    {
      id: 1,
      paymentID: 122,
      date: '02/02/20 14:28pm',
      description: 'Pago colectado par empleado',
      amount: '50.00'
    }
  ]
}
