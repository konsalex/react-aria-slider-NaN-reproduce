import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Slider } from './slider';
import userEvent from '@testing-library/user-event';

describe('@neo4j-ndl/slider', () => {

    test('single slider with steps', async () => {
        // Setup
        const mockOnChange = vi.fn();
        const { container } = render(
            <Slider
                showSteps={true}
                showValues={true}
                value={10}
                minValue={0}
                maxValue={100}
                step={10}
                onChange={mockOnChange}
            />,
        );

        // Test
        expect(container.querySelectorAll('.ndl-thumb').length).toBe(1);

        // Click on the thumb, expect tip to appear
        // then press left key, expect onChangeCallback to be called
        const thumb = container.querySelector('.ndl-thumb');
        if (!thumb) throw new Error('Thumb not found');
        await userEvent.hover(thumb);

        await waitFor(() => {
            expect(screen.getByRole('tooltip')).toBeInTheDocument();
        });

        await userEvent.click(thumb);
        /** In js-dom clicking the thumb triggers an onChange */
        expect(mockOnChange).toHaveBeenCalledTimes(1);

        await userEvent.keyboard('{ArrowLeft}');
        await waitFor(() => {
            expect(mockOnChange).toHaveBeenCalledTimes(2);
        });
    });

    test('range slider with steps', async () => {
        // Setup
        const mockOnChange = vi.fn();
        const { container } = render(
            <Slider
                showSteps={true}
                showValues={true}
                type="range"
                values={[20, 40]}
                minValue={10}
                maxValue={50}
                step={10}
                onChange={mockOnChange}
            />,
        );

        // Test
        expect(container.querySelectorAll('.ndl-thumb').length).toBe(2);


        // Click on the thumb, expect tip to appear
        // then press left key, expect onChangeCallback to be called
        const thumb = container.querySelector('.ndl-thumb');
        if (!thumb) throw new Error('Thumb not found');
        await userEvent.hover(thumb);

        await waitFor(() => {
            expect(screen.getByRole('tooltip')).toBeInTheDocument();
        });

        await userEvent.click(thumb);
        /** In js-dom clicking the thumb triggers an onChange */
        expect(mockOnChange).toHaveBeenCalledTimes(1);

        await userEvent.keyboard('{ArrowLeft}');
        await waitFor(() => {
            expect(mockOnChange).toHaveBeenCalledTimes(2);
        });
    });
});
