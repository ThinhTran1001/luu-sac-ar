import type { DetailedHTMLProps, HTMLAttributes } from 'react';

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'model-viewer': DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> & {
        src?: string;
        alt?: string;
        poster?: string;
        ar?: boolean;
        'ar-modes'?: string;
        'ar-scale'?: 'auto' | 'fixed';
        'ar-placement'?: 'floor' | 'wall';
        'ios-src'?: string;
        'camera-controls'?: boolean;
        'touch-action'?: string;
        'auto-rotate'?: boolean;
        'auto-rotate-delay'?: string;
        'rotation-per-second'?: string;
        'shadow-intensity'?: string;
        'shadow-softness'?: string;
        'environment-image'?: string;
        exposure?: string;
        'field-of-view'?: string;
        'min-field-of-view'?: string;
        'max-field-of-view'?: string;
        'camera-orbit'?: string;
        'camera-target'?: string;
        'min-camera-orbit'?: string;
        'max-camera-orbit'?: string;
        'interaction-prompt'?: 'auto' | 'none';
        'interaction-prompt-threshold'?: string;
        loading?: 'auto' | 'lazy' | 'eager';
        reveal?: 'auto' | 'manual';
        'xr-environment'?: boolean;
      };
    }
  }
}

export interface ModelViewerElement extends HTMLElement {
  resetTurntableRotation: () => void;
  fieldOfView: string;
  cameraOrbit: string;
  cameraTarget: string;
  src: string;
  alt: string;
  poster: string;
  activateAR: () => Promise<void>;
  canActivateAR: boolean;
}