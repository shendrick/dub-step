import React from 'react';
import { render, mount } from 'enzyme';
import DubStep from '../src/dub-step';

test('Renders without errors', () => {
  render(<DubStep>{({ step }) => <div>{step}</div>}</DubStep>);
});

test('Throws if cycle prop is provided without a total prop', () => {
  const element = <DubStep cycle>{({ step }) => <div>{step}</div>}</DubStep>;
  expect(() => render(element)).toThrow();
});

test('Throws if autoPlay prop is provided without a duration prop', () => {
  const element = <DubStep autoPlay>{({ step }) => <div>{step}</div>}</DubStep>;
  expect(() => render(element)).toThrow();
});

test('Starts playing on mount if duration/autoPlay is provided', () => {
  const spy = jest.spyOn(DubStep.prototype, 'startPlaying');
  const element = mount(
    <DubStep autoPlay duration={150}>
      {({ step }) => <div>{step}</div>}
    </DubStep>
  );
  expect(element.state().paused).toBe(false);
  expect(spy).toHaveBeenCalled();
});

test('Stops playing on will unmount if is provided', () => {
  const spy = jest.spyOn(DubStep.prototype, 'stopPlaying');
  const element = mount(
    <DubStep autoPlay duration={150}>
      {({ step }) => <div>{step}</div>}
    </DubStep>
  );
  element.unmount();
  expect(spy).toHaveBeenCalled();
});

test('Play/Pause component start/stop timer', () => {
  const pauseSpy = jest.fn();
  const playSpy = jest.fn();
  const element = mount(
    <DubStep duration={150} onPause={pauseSpy} onPlay={playSpy}>
      {({ paused, Pause, Play }) => (
        <div>
          {`${paused}`}
          <Pause className="pause">Pause</Pause>
          <Play className="play">Play</Play>
        </div>
      )}
    </DubStep>
  );
  element.find('button.play').simulate('click');
  expect(playSpy).toHaveBeenCalled();
  expect(element.state().paused).toBe(false);
  element.find('button.pause').simulate('click');
  expect(pauseSpy).toHaveBeenCalled();
  expect(element.state().paused).toBe(true);
  expect(element).toMatchSnapshot();
});

test('animating is set if animationSpeed is provided', done => {
  const element = mount(
    <DubStep animationSpeed={20}>
      {({ Next, animating }) => (
        <Next className="next">Next {animating && '✨'}</Next>
      )}
    </DubStep>
  );
  expect(element.state().animating).toBe(false);
  element.find('button.next').simulate('click');
  expect(element.state().animating).toBe(true);
  setTimeout(() => {
    expect(element.state().animating).toBe(false);
    done();
  }, 25);
});

test('Next component increments step', () => {
  const onNextSpy = jest.fn();
  const onBeforeChangeSpy = jest.fn();
  const onChangeSpy = jest.fn();
  const onAfterChangeSpy = jest.fn();
  const element = mount(
    <DubStep
      onNext={onNextSpy}
      onBeforeChange={onBeforeChangeSpy}
      onChange={onChangeSpy}
      onAfterChange={onAfterChangeSpy}
    >
      {({ Next, step }) => <Next className="next">Next {step}</Next>}
    </DubStep>
  );
  expect(element.state().step).toBe(0);
  element.find('button.next').simulate('click');
  expect(element.state().step).toBe(1);
  expect(onNextSpy).toHaveBeenCalled();
  expect(onBeforeChangeSpy).toHaveBeenCalled();
  expect(onChangeSpy).toHaveBeenCalled();
  expect(onAfterChangeSpy).toHaveBeenCalled();
  expect(element).toMatchSnapshot();
});

test('Previous component decrements step', () => {
  const onPrevSpy = jest.fn();
  const onBeforeChangeSpy = jest.fn();
  const onChangeSpy = jest.fn();
  const onAfterChangeSpy = jest.fn();
  const element = mount(
    <DubStep
      onPrevious={onPrevSpy}
      onBeforeChange={onBeforeChangeSpy}
      onChange={onChangeSpy}
      onAfterChange={onAfterChangeSpy}
    >
      {({ Previous, step }) => (
        <Previous className="previous">Back {step}</Previous>
      )}
    </DubStep>
  );
  expect(element.state().step).toBe(0);
  element.find('button.previous').simulate('click');
  expect(element.state().step).toBe(-1);
  expect(onPrevSpy).toHaveBeenCalled();
  expect(onBeforeChangeSpy).toHaveBeenCalled();
  expect(onChangeSpy).toHaveBeenCalled();
  expect(onAfterChangeSpy).toHaveBeenCalled();
  expect(element).toMatchSnapshot();
});

test('StepIndex component changes step to given number', () => {
  const STEP = 4;
  const onBeforeChangeSpy = jest.fn();
  const onChangeSpy = jest.fn();
  const onAfterChangeSpy = jest.fn();
  const element = mount(
    <DubStep
      onBeforeChange={onBeforeChangeSpy}
      onChange={onChangeSpy}
      onAfterChange={onAfterChangeSpy}
    >
      {({ StepIndex }) => (
        <StepIndex step={STEP} className="index">
          Go To {STEP}
        </StepIndex>
      )}
    </DubStep>
  );
  expect(element.state().step).toBe(0);
  element.find('button.index').simulate('click');
  expect(element.state().step).toBe(STEP);
  expect(onBeforeChangeSpy).toHaveBeenCalled();
  expect(onChangeSpy).toHaveBeenCalled();
  expect(onAfterChangeSpy).toHaveBeenCalled();
  expect(element).toMatchSnapshot();
});
