import { AppComponent } from './app.component';

describe('AppComponent', () => {
  it('creates the Angular root', () => {
    const component = new AppComponent();

    expect(component).toBeInstanceOf(AppComponent);
  });
});
