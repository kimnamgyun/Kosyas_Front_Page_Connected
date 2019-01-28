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

    function fnMove(seq) {
      const offset = $('#div' + seq).offset();
      $('html, body').animate({scrollTop : offset.top}, 400);
    }


//    $('.scroll').click(function (event) {
//      event.preventDefault();
//      $('html').animate({scrollTop: $(this.hash).offset().top}, 500);
//    }); {


//    }




    $(document).ready(function() {
      setTimeout(function() {
        $('html, body').scrollTop(0);
      }, 100);
    });



  }




  @HostListener('window:scroll', ['$event']) onScroll($event) {
    // console.log('$event.srcElement.scrollTop: ',$event.srcElement.scrollingElement.scrollTop);

    if ($event.srcElement.scrollingElement.scrollTop > 250) {
      this.backgroundColor = true;
    }
  }
}


 

