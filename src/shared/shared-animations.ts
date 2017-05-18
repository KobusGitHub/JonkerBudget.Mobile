import { trigger, state, style, transition, animate } from '@angular/core';

export const flyInOut = trigger('flyInOut', [
      state('in', style({
        transform: 'translate3d(0, 0, 0)'
      })),
      state('out', style({
        transform: 'translate3d(0, -100%, 0)'
      })),
      transition('in => out', animate('200ms ease-in')),
      transition('out => in', animate('200ms ease-out'))
    ]);


