declare module 'color-scheme' {
  class ColorScheme {
    from_hue(hue: number): this;
    scheme(scheme: string): this;
    variation(variation: string): this;
    colors(): string[];
  }
  export default ColorScheme;
}
