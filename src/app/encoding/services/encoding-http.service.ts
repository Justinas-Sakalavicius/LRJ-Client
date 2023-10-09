import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import {
  URL_ENCODE_START,
  URL_ENCODE_CANCEL,
  QUERY_PARAM_NAME,
} from 'src/app/core/constants/constants';

@Injectable({
  providedIn: 'root',
})
export class EncodingHttpService {
  constructor(private httpClient: HttpClient) {}

  encode(inputText: string): Observable<number> {
    let queryParams = new HttpParams();
    queryParams = queryParams.append(QUERY_PARAM_NAME, inputText);
    return this.httpClient.post<number>(
      `${URL_ENCODE_START}`,
      {},
      { params: queryParams }
    );
  }

  cancel(): Observable<string> {
    return this.httpClient.post<string>(`${URL_ENCODE_CANCEL}`, null);
  }
}
