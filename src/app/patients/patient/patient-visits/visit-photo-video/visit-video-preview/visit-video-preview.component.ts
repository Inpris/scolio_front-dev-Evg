import {ChangeDetectorRef, Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import { NzModalRef, NzModalService } from 'ng-zorro-antd';
import { VisitMediaPreviewComponent } from '@modules/patients/patient/patient-visits/visit-photo-video/visit-media-preview/visit-media-preview.component';

@Component({
  selector: 'sl-visit-video-preview',
  templateUrl: './visit-video-preview.component.html',
  styleUrls: ['./visit-video-preview.component.less'],
})
export class VisitVideoPreviewComponent extends VisitMediaPreviewComponent implements OnInit {
  @ViewChild('player') player: ElementRef;
  public hideControls = false;
  public isPlaying = false;

  constructor(modalService: NzModalService, private modal: NzModalRef, public cd: ChangeDetectorRef,) {
    super(modalService, cd);
  }

  end() {
    this.hideControls = false;
    this.isPlaying = false;
  }

  play() {
    if (this.isPlaying) {
      this.isPlaying = false;
      this.player.nativeElement.pause();
      return;
    }
    this.player.nativeElement.play();
    this.isPlaying = true;
    this.hideControls = true;
    this.player.nativeElement.addEventListener('ended', function () {
      this.displayControls = false;
    });
  }

  mouseover() {
    this.hideControls = false;
  }

  mouseleave() {
    if (this.isPlaying) {
      this.hideControls = true;
    }
  }

  fullscreen() {
    const player = this.player.nativeElement;
    if (player.requestFullscreen) {
      player.requestFullscreen();
    } else if (player.mozRequestFullScreen) {
      player.mozRequestFullScreen(); // Firefox
    } else if (player.webkitRequestFullscreen) {
      player.webkitRequestFullscreen(); // Chrome and Safari
    }
  }

  close() {
    this.modal.destroy();
  }

  ngOnInit() {
  }
}
