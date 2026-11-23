import { render, screen } from '@testing-library/react-native';

import { OfflineBanner } from './OfflineBanner';

describe('OfflineBanner', () => {
  it('tells the user the data comes from the device', async () => {
    await render(<OfflineBanner />);

    expect(screen.getByText('Sin conexión. Mostrando datos guardados.')).toBeTruthy();
    expect(screen.getByRole('alert')).toBeTruthy();
  });
});
