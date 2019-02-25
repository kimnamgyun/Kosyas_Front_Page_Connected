import { Component, OnInit, HostListener } from '@angular/core';
import * as $ from 'jquery';
import 'slick-carousel';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent implements OnInit {
	private backgroundColor: boolean;
	private translate: TranslateService;

	constructor( translate: TranslateService) {
    this.translate = translate;
    this.translate.setDefaultLang('ko');
  }

  public switchLanguage( lang: string ): void {
    this.translate.use(lang);
  }

  ngOnInit() {

 $('.slide-container').slick({
      autoplay : true,
      dots: true,
      speed: 200,
      infinite: true,
      autoplaySpeed: 3000,
      arrows: true,
      slidesToShow: 3,
      slidesToScroll: 1,
      fade: false,
      centerMode: true,
      centerPadding: '0px'
    });
  }

  @HostListener('window:scroll', ['$event']) onScroll($event) {
    // console.log('$event.srcElement.scrollTop: ',$event.srcElement.scrollingElement.scrollTop);

    if ($event.srcElement.scrollingElement.scrollTop > 250) {
      this.backgroundColor = true;
    }
  }
}


 

