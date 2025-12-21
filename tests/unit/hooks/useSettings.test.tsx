/**
 * Unit tests for useSettings
 * Verifies settings persistence to localStorage
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { render } from '@testing-library/preact';
import { act } from 'preact/test-utils';
import { useSettings } from '../../../src/ui/hooks/useSettings';

describe('useSettings', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('persists updates to localStorage', () => {
    function TestComponent() {
      const { updateSettings } = useSettings();
      return (
        <button type="button" onClick={() => updateSettings({ musicVolume: 55 })}>
          Save
        </button>
      );
    }

    const { getByText } = render(<TestComponent />);

    act(() => {
      getByText('Save').click();
    });

    const saved = localStorage.getItem('vale:settings');
    expect(saved).not.toBeNull();
    expect(JSON.parse(saved!)).toMatchObject({ musicVolume: 55 });
  });
});
