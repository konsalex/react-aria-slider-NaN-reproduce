// eslint-disable react/prop-types
import React, {forwardRef } from "react";
import classNames from "classnames";
import {mergeProps, useFocusRing, useSlider, useSliderThumb, VisuallyHidden} from "react-aria";
import {useSliderState} from "react-stately";
import { Tip } from "@neo4j-ndl/react";
import '@neo4j-ndl/base/lib/neo4j-ds-styles.css';

export const Slider = forwardRef(function SliderComponent(
    {
        rootProps = {},
        inputProps = {},
        minValue = 0,
        maxValue = 100,
        isDisabled = false,
        showSteps = false,
        showValues = false,
        step = 1,
        type = 'single',
        onChange,
        ...restProps
    },
    ref,
) {
    const trackRef = React.useRef(null);

    const castedValue =
        type === 'range'
            ? restProps.values
        : restProps.value;

    const castedOnChange = onChange;

    const state = useSliderState({
        isDisabled,
        minValue,
        maxValue,
        step,
        defaultValue: castedValue,
        numberFormatter: new Intl.NumberFormat('en-US'),
        onChange: onChange,
    });

    const { groupProps, trackProps } = useSlider(
        { 'aria-label': 'slider' },
        state,
        trackRef,
    );

    const mergedProps = mergeProps(groupProps, rootProps);

    return (
        <div
            {...mergedProps}
            className={classNames('ndl-slider', rootProps.className)}
            role="presentation"
            ref={ref}
        >
            {/* The track element holds the visible track line, the filled track line and the thumb. */}
            <div
                {...trackProps}
                ref={trackRef}
                className={classNames('ndl-track', {
                    'ndl-is-disabled': state.isDisabled,
                })}
            >
                <Thumb
                    index={0}
                    state={state}
                    trackRef={trackRef}
                    showValues={showValues}
                    inputForwardedProps={inputProps}
                />
                {type === 'range' && (
                    <Thumb
                        index={1}
                        state={state}
                        trackRef={trackRef}
                        showValues={showValues}
                        inputForwardedProps={inputProps}
                    />
                )}
            </div>
        </div>
    )}
);


// eslint-disable-next-line no-unused-vars
function Thumb(props) {
    const { state, trackRef, index, inputForwardedProps } = props;
    const inputRef = React.useRef(null);
    const { thumbProps, inputProps, isDragging } = useSliderThumb(
        {
            index,
            trackRef,
            inputRef,
            name: 'slider-thumb',
        },
        state,
    );

    const { focusProps, isFocusVisible } = useFocusRing();

    /**
     * Solve issue with:
     * Warning: Received NaN for the `value` attribute. If this is expected, cast the value to a string.
     * Receiving NaN for other attributes also, like `max`. Waiting for a fix in react-aria.
     * @see https://github.com/adobe/react-spectrum/issues/5859
     * @see https://github.com/adobe/react-spectrum/pull/5861
     */
    const mergedProps = mergeProps(
        inputProps,
        focusProps,
        // Omitting aria-valuetext double announcements, unless explicitly provided
        { 'aria-valuetext': '' },
        inputForwardedProps,
    );
    const value =
        mergedProps.value || mergedProps.value === 0 ? mergedProps.value : '';

    return (
        <Tip
            isDisabled={props.showValues !== true}
            isOpen={isDragging || undefined}
            allowedPlacements={['top']}
        >
            <Tip.Trigger>
                <div
                    {...thumbProps}
                    className={classNames('ndl-thumb', {
                        'ndl-is-dragging': isDragging,
                        'ndl-focus': isFocusVisible,
                    })}
                >
                    <VisuallyHidden>
                        <input ref={inputRef} {...mergedProps} />
                    </VisuallyHidden>
                </div>
            </Tip.Trigger>
            <Tip.Content>
                <Tip.Body>{value}</Tip.Body>
            </Tip.Content>
        </Tip>
    );
}

export default Slider;




