import { Injectable } from '@angular/core';
import { VertebraTorsion } from '@common/interfaces/Measurement';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

interface VertebraTorsionCoefficient {
  koeff: number;
  rotation: number;
}

interface VertebraTorsionResponse {
  torsionCoefficients: VertebraTorsionCoefficient[];
}

@Injectable()
export class VertebraTorsionService {
  constructor(private http: HttpClient) {
  }

  getTorsionCoefficient(torsion: VertebraTorsion): Observable<number> {
    const rotation = new Subject<number>();
    this.getTorsionCoefficients()
        .subscribe((response: VertebraTorsionCoefficient[]) => {
          const coefficient = Math.max(torsion.segment1Length, torsion.segment2Length) / Math.min(torsion.segment1Length, torsion.segment2Length);
          const nearestValue = response.reduce((previousValue: VertebraTorsionCoefficient, value: VertebraTorsionCoefficient) =>
            (Math.abs(value.koeff - coefficient) < Math.abs(previousValue.koeff - coefficient)) ? value : previousValue);
          rotation.next(nearestValue.rotation);
        });
    return rotation;
  }

  getTorsionCoefficients() {
    return this.http.get('/assets/mock/vertebra-torsion.json')
               .map((value: VertebraTorsionResponse) => value.torsionCoefficients);
  }
}
