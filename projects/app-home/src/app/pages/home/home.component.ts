import { Component, OnInit, Renderer2 } from '@angular/core';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.less']
})
export class HomeComponent implements OnInit {
  public pos = 0;

  public display = false;
  public nav = false;
  public backgrounds = [
    'url(assets/home/bg-top2.jpg) center top no-repeat',
    'url(assets/home/bg-top.jpg) center top no-repeat',
    'url(assets/home/bg-top3.jpg) center top no-repeat'
  ];
  public texts = [
    ['Desenvolva sua paixão', 'Faça o que você realmente gosta e construa o seu próprio negócio'],
    ['Tenha mais tempo para sua família', 'Seja dono do seu própio tempo e invista-o no que realmente importa'],
    ['Aprenda com os melhores', 'Capacite-se nas profissões do presente e do futuro e construa uma renda crescente'],
  ];

  constructor(private renderer: Renderer2) { }

  ngOnInit() {
    setInterval(x => {
      if (this.pos === this.backgrounds.length - 1) {
        this.pos = 0;
      } else {
        this.pos++;
      }
    }, 15000);
  }
  scroll(el) {
    el.scrollIntoView({ behavior: 'smooth' });
    this.display = false;
  }

  onIntersection({ target, visible }: { target: Element; visible: boolean }): void {
    this.renderer.addClass(target, visible ? 'active-animate' : '_');
    // this.renderer.removeClass(target, visible ? 'inactive' : 'active');
  }
  onIntersectionNav({ target, visible }: { target: Element; visible: boolean }): void {
    this.nav = !visible;
  }
  goLogin() {
    window.location.href = environment.loginYouhub;
  }
  goToSocial(network) {
    switch (network) {
      case 'facebook':
        window.open('https://www.facebook.com/pg/youhub.oficial/', '_blank');
        break;
      case 'instagram':
        window.open('https://www.instagram.com/youhub.oficial/', '_blank');
        break;
      case 'youtube':
        window.open('https://www.youtube.com/channel/UCodrPzyqtRjmN9-UL_tJjHg?view_as=subscriber', '_blank');
        break;

      default:
        break;
    }
  }
}
