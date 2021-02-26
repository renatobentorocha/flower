import { StatusBar } from 'expo-status-bar';
import React, { useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  block,
  clockRunning,
  cond,
  Easing,
  Extrapolate,
  greaterThan,
  interpolate,
  not,
  set,
  startClock,
  timing,
} from 'react-native-reanimated';

const PI_INTERVAL = Math.PI / 8;
const PI_CEIL = Math.ceil((2 * Math.PI) / PI_INTERVAL);

const withTiming = (
  clock: Animated.Clock,
  toValue: number,
  reverse: Animated.Value<number> = new Animated.Value<number>(0)
) => {
  const _position = new Animated.Value<number>(0);
  const _toValue = toValue;

  const state: Animated.TimingState = {
    finished: new Animated.Value<number>(0),
    frameTime: new Animated.Value<number>(0),
    position: new Animated.Value<number>(0),
    time: new Animated.Value<number>(0),
  };

  const config: Animated.TimingConfig = {
    duration: 3000,
    easing: Easing.inOut(Easing.linear),
    toValue: new Animated.Value<number>(toValue),
  };

  return block([
    cond(not(clockRunning(clock)), startClock(clock)),
    timing(clock, state, config),
    cond(state.finished, [
      set(state.finished, 0),
      set(state.frameTime, 0),
      set(state.time, 0),

      cond(
        reverse,
        cond(
          greaterThan(config.toValue, 0),
          set(config.toValue, _position),
          set(config.toValue, _toValue)
        ),
        set(state.position, 0)
      ),
    ]),
    state.position,
  ]);
};

export default function App() {
  const clock = useRef(new Animated.Clock()).current;
  const progress = withTiming(clock, Math.PI * 2);

  const progressX = withTiming(
    clock,
    Math.PI * 2,
    new Animated.Value<number>(1)
  );

  const translateX = interpolate(progressX, {
    inputRange: [0, Math.PI * 2],
    outputRange: [-100, 0],
    extrapolate: Extrapolate.CLAMP,
  });

  const scale = interpolate(progressX, {
    inputRange: [0, Math.PI * 2],
    outputRange: [1, 0.5],
    extrapolate: Extrapolate.CLAMP,
  });

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          {
            alignItems: 'center',
          },
          {
            transform: [{ rotate: progress }],
          },
        ]}
      >
        {Array<number>(PI_CEIL)
          .fill(PI_INTERVAL)
          .map((element, index) => {
            return (
              <Animated.View
                key={index}
                style={[
                  styles.petal,
                  { position: 'absolute' },
                  {
                    transform: [
                      { translateY: -100 / 2 },
                      { rotate: `${element * index}` },
                      { translateX },

                      { scaleX: 1.5 },
                      { scale },
                    ],
                  },
                ]}
              />
            );
          })}
      </Animated.View>

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#130101',
    alignItems: 'center',
    justifyContent: 'center',
  },
  petal: {
    width: 100,
    height: 100,
    borderWidth: 1,
    borderRadius: 50,
    borderColor: '#4c00ff',
  },
});
