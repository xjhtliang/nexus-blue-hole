
export type LanguageCode = 'zh-CN' | 'en-US';

export interface LanguageOption {
  code: LanguageCode;
  name: string;
  nativeName: string;
  flag: string;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  {
    code: 'zh-CN',
    name: 'Chinese',
    nativeName: '简体中文',
    flag: '🇨🇳'
  },
  {
    code: 'en-US',
    name: 'English',
    nativeName: 'English (US)',
    flag: '🇺🇸'
  }
];

export type Namespace = 
  | 'common' 
  | 'navigation' 
  | 'neuron' 
  | 'work' 
  | 'life' 
  | 'system';
