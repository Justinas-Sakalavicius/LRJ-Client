import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/internal/operators/first';
import { SubscriptionLike } from 'rxjs/internal/types';
import { EncodingHttpService } from './services/encoding-http.service';
import { HubService } from '../core/hub/hub.service';
import { Observable } from 'rxjs/internal/Observable';
import {
  ERROR_MESSAGE_WHILE_CANCELING,
  ERROR_MESSAGE_WHILE_ENCODING,
  INPUT_TEXT_REQUIRED,
} from '../core/constants/constants';

@Component({
  selector: 'app-encoding',
  templateUrl: './encoding.component.html',
  styleUrls: ['./encoding.component.scss'],
})
export class EncodingComponent implements OnInit, OnDestroy {
  encodingForm!: FormGroup;
  outputText!: string;
  submitting: boolean = false;
  messages$: Observable<string> = this.hubService.getMessages();
  errorRequired = INPUT_TEXT_REQUIRED;

  private expectedMessageCount: number = 0;
  private converSubscription!: SubscriptionLike;
  private messagesSubscription!: SubscriptionLike;
  private cancelSubscription!: SubscriptionLike;

  constructor(
    private fb: FormBuilder,
    private encodinghttpService: EncodingHttpService,
    private hubService: HubService
  ) {}

  ngOnInit(): void {
    this.encodingForm = this.fb.group({
      inputText: ['', Validators.required],
    });
    this.outputText = '';
  }

  ngOnDestroy(): void {
    this.converSubscription.unsubscribe();
    this.cancelSubscription.unsubscribe();
    this.messagesSubscription.unsubscribe();
    this.hubService.disconnect();
  }

  convert(): void {
    if (this.encodingForm.valid) {
      this.outputText = '';
      this.submitting = true;
      const inputText: string = this.encodingForm.get('inputText')!.value;
      this.expectedMessageCount = 0;

      this.converSubscription = this.encodinghttpService
        .encode(inputText)
        .pipe(first())
        .subscribe({
          next: (count: number) => {
            if (this.messagesSubscription) {
              this.messagesSubscription.unsubscribe();
            }
            this.messagesSubscription = this.messages$.subscribe(
              (message: string) => {
                this.outputText += message;
                this.expectedMessageCount++;
                if (this.expectedMessageCount === count) {
                  this.submitting = false;
                }
              }
            );
          },
          error: (error) => {
            console.error(ERROR_MESSAGE_WHILE_ENCODING, error);
          },
        });
    }
  }

  cancel(): void {
    if (this.submitting === true) {
      this.cancelSubscription = this.encodinghttpService
        .cancel()
        .pipe(first())
        .subscribe({
          next: () => {
            this.submitting = false;
            this.encodingForm.reset();
          },
          error: (error) => {
            console.error(ERROR_MESSAGE_WHILE_CANCELING, error);
          },
        });
    }
  }
}
