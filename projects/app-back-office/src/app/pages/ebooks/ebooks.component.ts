import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash';

@Component({
  selector: 'app-back-office-ebooks',
  templateUrl: './ebooks.component.html',
  styleUrls: ['./ebooks.component.less']
})
export class EbooksComponent implements OnInit {

  public ebooks = [
    {
      img: 'assets/ebooks/4-GRANDES-LIDERES.jpg',
      pdf: 'https://s3.amazonaws.com/youhub-files/production/backoffice/E-books/GRANDES+LIDERES.pdf'
    },
    {
      img: 'assets/ebooks/ATENDER.jpg',
      pdf: 'https://s3.amazonaws.com/youhub-files/production/backoffice/E-books/ATENDER.pdf'
    },
    {
      img: 'assets/ebooks/CAMINHOS-DA-LIDERANÇA.jpg',
      pdf: 'https://s3.amazonaws.com/youhub-files/production/backoffice/E-books/LIDERANCA.pdf'
    },
    {
      img: 'assets/ebooks/como-convencer-algém-em-90-segundos.jpg',
      pdf: 'https://s3.amazonaws.com/youhub-files/production/backoffice/E-books/90_SEGUNDOS.pdf'
    },
    {
      img: 'assets/ebooks/CONSTRUA-AMIZADES.jpg',
      pdf: 'https://s3.amazonaws.com/youhub-files/production/backoffice/E-books/CONSTRUA+AMIZADES.pdf'
    },
    {
      img: 'assets/ebooks/ETHOS.jpg',
      pdf: 'https://s3.amazonaws.com/youhub-files/production/backoffice/E-books/ETHOS.pdf'
    },
    {
      img: 'assets/ebooks/Manual-do-exito.jpg',
      pdf: 'https://s3.amazonaws.com/youhub-files/production/backoffice/E-books/manual+do+exito.pdf'
    },
    {
      img: 'assets/ebooks/Otimize-seu-trabalho-em-HOME-OFFICE.jpg',
      pdf: 'https://s3.amazonaws.com/youhub-files/production/backoffice/E-books/HOMMEOFFICE.pdf'
    },
    {
      img: 'assets/ebooks/A-importancia.jpg',
      pdf: 'https://s3.amazonaws.com/youhub-files/production/backoffice/E-books/nao.pdf'
    },
    {
      img: 'assets/ebooks/Como-Funciona.jpg',
      pdf: 'https://s3.amazonaws.com/youhub-files/production/backoffice/E-books/MENTE+DOS+VENDEDORES.pdf'
    },
    {
      img: 'assets/ebooks/Foco-nas-vendas.jpg',
      pdf: 'https://s3.amazonaws.com/youhub-files/production/backoffice/E-books/MOTIVACAO.pdf'
    },
    {
      img: 'assets/ebooks/neuromarketing.jpg',
      pdf: 'https://s3.amazonaws.com/youhub-files/production/backoffice/E-books/neuromarketing.pdf'
    },
    {
      img: 'assets/ebooks/Scrum.jpg',
      pdf: 'https://s3.amazonaws.com/youhub-files/production/backoffice/E-books/SCRUM.pdf'
    },
    {
      img: 'assets/ebooks/Teoria-nudge.jpg',
      pdf: 'https://s3.amazonaws.com/youhub-files/production/backoffice/E-books/NUDGE.pdf'
    },
    {
      img: 'assets/ebooks/persuasao.jpg',
      pdf: 'https://s3.amazonaws.com/youhub-files/production/backoffice/E-books/persuasao.pdf'
    },
    {
      img: 'assets/ebooks/REUNIOES_APRESENTACOES.jpg',
      pdf: 'https://s3.amazonaws.com/youhub-files/production/backoffice/E-books/REUNIOES_APRESENTACOES.pdf'
    },
    {
      img: 'assets/ebooks/pomodoro.jpg',
      pdf: 'https://s3.amazonaws.com/youhub-files/production/backoffice/E-books/POMODORO.pdf'
    },
    {
      img: 'assets/ebooks/Redes-sociais.jpg',
      pdf: 'https://s3.amazonaws.com/youhub-files/production/backoffice/E-books/REDES+SOCIAIS.pdf'
    },
    {
      img: 'assets/ebooks/personal-branding.jpg',
      pdf: 'https://s3.amazonaws.com/youhub-files/production/backoffice/E-books/personal+branding.pdf'
    },
    {
      img: 'assets/ebooks/rapport.jpg',
      pdf: 'https://s3.amazonaws.com/youhub-files/production/backoffice/E-books/rapport.pdf'
    },
  ];

  constructor() {
    this.ebooks = _.shuffle(this.ebooks);
  }

  ngOnInit() { }

}
