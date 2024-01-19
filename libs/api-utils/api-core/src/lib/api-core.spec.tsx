import { render } from '@testing-library/react';

import ApiCore from './api-core';

describe('ApiCore', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<ApiCore />);
    expect(baseElement).toBeTruthy();
  });
});
