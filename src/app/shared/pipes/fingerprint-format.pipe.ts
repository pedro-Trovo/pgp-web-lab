import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'fingerprintFormat', standalone: true })
export class FingerprintFormatPipe implements PipeTransform {
  transform(fingerprint: string): string {
    if (!fingerprint) return '';
    return fingerprint.toUpperCase().match(/.{1,4}/g)?.join(' ') || fingerprint;
  }
}
